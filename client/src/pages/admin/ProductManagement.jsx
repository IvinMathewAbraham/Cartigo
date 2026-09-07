import React, { useState, useRef, useEffect } from 'react';
import './ProductManagement.css';
import { createProduct, createVariant, createProductImage, getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { getBrands } from "@/services/brand.service";
import Header from '../../components/layout/Header/Header';

export default function ProductManagement() {
  // Navigation / View state ('list' or 'create')
  const [view, setView] = useState('list');

  // UI Panel Toggle
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Dynamic Async Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  // Base Product Data Form
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    status: "active",
  });

  // Global pool of images uploaded to this base product
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  /* Dynamic Architecture for Variants */
  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      sku: "",
      price: "",
      stockLevel: "",
      color: "Black",
      storage: "128GB",
      variantImage: ""
    }
  ]);

  // Load Categories and Brands globally
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([getCategories(), getBrands()]);
        setCategories(categoryRes.data || []);
        setBrands(brandRes.data || []);
      } catch (error) {
        console.error("Dependency loading failed:", error);
      }
    };
    loadDependencies();
  }, []);

  // Fetch products list whenever view changes to 'list'
  useEffect(() => {
    if (view === 'list') {
      const loadProducts = async () => {
        setIsLoadingList(true);
        try {
          if (typeof getProducts === 'function') {
            const res = await getProducts();
            setProducts(res.data || res || []);
          } else {
            // Fallback mock array if service method isn't immediately matching
            setProducts([
              { id: "1", name: "iPhone 16 Pro", categoryId: "1", brandId: "1", status: "active", description: "Sample product" }
            ]);
          }
        } catch (error) {
          console.error("Failed to load products list:", error);
        } finally {
          setIsLoadingList(false);
        }
      };
      loadProducts();
    }
  }, [view]);

  // Form helper for flat metadata inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  // Helper utility to update array properties of individual variants
  const handleVariantChange = (id, field, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addVariantRow = () => {
    setVariants(prev => [...prev, {
      id: Date.now(),
      sku: "",
      price: "",
      stockLevel: "",
      color: "Black",
      storage: "128GB",
      variantImage: ""
    }]);
  };

  const removeVariantRow = (id) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter(v => v.id !== id));
    }
  };

  // Image File Upload Drag/Drop Logic
  const processFiles = (files) => {
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const newPreviews = fileArray.map(file => URL.createObjectURL(file));
      setUploadedFiles(prev => [...prev, ...fileArray]);
      setUploadedImages(prev => [...prev, ...newPreviews]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  // Orchestrating Relationship Creation sequentially with Backend API
  const handlePublish = async () => {
    try {
      const generatedSlug = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

      const basePayload = {
        name: productForm.name,
        slug: generatedSlug,
        description: productForm.description,
        categoryId: productForm.categoryId,
        brandId: productForm.brandId,
        status: productForm.status,
      };

      console.log("Creating Base Product...", basePayload);
      const newProduct = await createProduct(basePayload);
      const createdProductId = newProduct?.id || 999; 

      if (uploadedFiles.length > 0) {
        await Promise.all(uploadedFiles.map(file => {
          const formData = new FormData();
          formData.append("image", file);
          return createProductImage(createdProductId, formData);
        }));
      }

      await Promise.all(variants.map(variant => {
        const variantPayload = {
          sku: variant.sku,
          price: parseFloat(variant.price) || 0,
          stock: parseInt(variant.stockLevel, 10) || 0,
          attributeValueIds: [101, 202], 
        };
        return createVariant(createdProductId, variantPayload);
      }));

      alert("Enterprise Product Stack Created Successfully!");
      
      // Reset Form states & route back to listing
      setProductForm({ name: "", description: "", categoryId: "", brandId: "", status: "active" });
      setUploadedFiles([]);
      setUploadedImages([]);
      setVariants([{ id: Date.now(), sku: "", price: "", stockLevel: "", color: "Black", storage: "128GB", variantImage: "" }]);
      setView('list');
    } catch (err) {
      console.error("Transaction Pipeline Aborted:", err);
    }
  };

  // Helper matching names for Category/Brand representations in tables
  const getCategoryName = (id) => categories.find(c => String(c.id) === String(id))?.name || id || 'N/A';
  const getBrandName = (id) => brands.find(b => String(b.id) === String(id))?.name || id || 'N/A';

  return (
    <>
      <Header />
      <div className="page-container">
        <aside className="sidebar-shell">
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              className={view === 'list' ? "nav-link-active" : "nav-link"} 
              style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '8px 12px' }}
              onClick={() => setView('list')}
            >
              All Products List
            </button>
            <button 
              className={view === 'create' ? "nav-link-active" : "nav-link"} 
              style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', padding: '8px 12px' }}
              onClick={() => setView('create')}
            >
              + Create Product
            </button>
          </nav>
        </aside>

        <main className="main-canvas">
          <div className="content-wrapper">
            
            {/* VIEW 1: PRODUCTS LIST VIEW */}
            {view === 'list' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h2 style={{ margin: 0, fontSize: '28px' }}>Product Catalog</h2>
                  <button onClick={() => setView('create')} style={{ padding: '8px 16px', backgroundColor: '#0070f3', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                    + New Product
                  </button>
                </div>

                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #eee' }}>
                  {isLoadingList ? (
                    <p>Loading active marketplace catalog...</p>
                  ) : products.length === 0 ? (
                    <p style={{ textAlign: 'center', padding: '40px 0', color: '#666' }}>No products found. Click "New Product" to begin populating database fields.</p>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid #eee', fontSize: '14px', color: '#666' }}>
                          <th style={{ padding: '12px 8px' }}>ID</th>
                          <th style={{ padding: '12px 8px' }}>Product Name</th>
                          <th style={{ padding: '12px 8px' }}>Category</th>
                          <th style={{ padding: '12px 8px' }}>Brand</th>
                          <th style={{ padding: '12px 8px' }}>Status</th>
                          <th style={{ padding: '12px 8px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((prod) => (
                          <tr key={prod.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '12px 8px', fontSize: '14px', color: '#888' }}>{prod.id}</td>
                            <td style={{ padding: '12px 8px', fontWeight: '500' }}>{prod.name}</td>
                            <td style={{ padding: '12px 8px' }}>{getCategoryName(prod.categoryId)}</td>
                            <td style={{ padding: '12px 8px' }}>{getBrandName(prod.brandId)}</td>
                            <td style={{ padding: '12px 8px' }}>
                              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '12px', textTransform: 'capitalize', background: prod.status === 'active' ? '#e6f4ea' : '#fce8e6', color: prod.status === 'active' ? '#137333' : '#c5221f' }}>
                                {prod.status || 'Active'}
                              </span>
                            </td>
                            <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                              <button style={{ background: 'none', border: 'none', color: '#0070f3', cursor: 'pointer', marginRight: '12px' }}>Edit</button>
                              <button style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* VIEW 2: CREATE PRODUCT FORM VIEW */}
            {view === 'create' && (
              <div>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '24px' }}>
                  <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>← Back to catalog</button>
                  <h2 style={{ margin: 0, fontSize: '28px' }}>Create Product </h2>
                </div>

                <div className="layout-grid">
                  <div className="col-main" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Section 1: Core Master Details */}
                    <section className="bento-card-section">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Master Specifications</h3>
                        <button type="button" onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}>Toggle Layout</button>
                      </div>
                      {isBasicInfoOpen && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                          <div>
                            <label className="form-label">Product Name</label>
                            <input name="name" value={productForm.name} onChange={handleInputChange} className="form-input" placeholder="e.g. iPhone 16 Pro" type="text" />
                          </div>
                          <div>
                            <label className="form-label">Master Description</label>
                            <textarea name="description" value={productForm.description} onChange={handleInputChange} className="text-editor-textarea" rows={4} placeholder="General marketing overview copy..." />
                          </div>
                          <div style={{ display: 'flex', gap: '16px' }}>
                            <div style={{ flex: 1 }}>
                              <label className="form-label">Category Node</label>
                              <select name="categoryId" value={productForm.categoryId} onChange={handleInputChange} className="form-input">
                                <option value="">Select Category</option>
                                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                              </select>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label className="form-label">Brand Assignment</label>
                              <select name="brandId" value={productForm.brandId} onChange={handleInputChange} className="form-input">
                                <option value="">Select Brand</option>
                                {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                              </select>
                            </div>
                            <div style={{ flex: 1 }}>
                              <label className="form-label">Lifecycle Status</label>
                              <select name="status" value={productForm.status} onChange={handleInputChange} className="form-input">
                                <option value="active">Active</option>
                                <option value="draft">Draft</option>
                                <option value="archived">Archived</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                    </section>

                    {/* Section 2: Media Asset Pool */}
                    <section className="bento-card-section">
                      <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Global Media Pool</h3>
                      <div className="media-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                        <div
                          className={`drag-upload-zone ${isDragging ? 'bg-dragging' : ''}`}
                          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                          onDragLeave={() => setIsDragging(false)}
                          onDrop={handleDrop}
                          onClick={() => fileInputRef.current?.click()}
                          style={{ border: '2px dashed #ccc', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100px', cursor: 'pointer' }}
                        >
                          <input type="file" multiple accept="image/*" hidden ref={fileInputRef} onChange={(e) => processFiles(e.target.files)} />
                          <span style={{ fontSize: '12px' }}>Upload Asset</span>
                        </div>

                        {uploadedImages.map((src, index) => (
                          <div key={index} style={{ border: '1px solid #ccc', borderRadius: '8px', height: '100px', overflow: 'hidden', position: 'relative' }}>
                            <img src={src} alt="Pool" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    </section>

                    {/* Section 3: Granular Variations Interface Matrix */}
                    <section className="bento-card-table-section" style={{ background: '#fff', padding: '20px', borderRadius: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px' }}>Configurable Variants (Matrix)</h3>
                        <button type="button" onClick={addVariantRow} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer' }}>+ Add Custom Variant</button>
                      </div>

                      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #eee', fontSize: '14px', color: '#666' }}>
                            <th style={{ padding: '8px' }}>Color SKU Attribute</th>
                            <th style={{ padding: '8px' }}>Storage Level</th>
                            <th style={{ padding: '8px' }}>Unique SKU String</th>
                            <th style={{ padding: '8px' }}>Variant Price ($)</th>
                            <th style={{ padding: '8px' }}>Stock Qty</th>
                            <th style={{ padding: '8px' }}>Assigned Image</th>
                            <th style={{ padding: '8px' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {variants.map((variant) => (
                            <tr key={variant.id} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '8px' }}>
                                <select value={variant.color} onChange={(e) => handleVariantChange(variant.id, 'color', e.target.value)}>
                                  <option value="Black">Space Black</option>
                                  <option value="Silver">Silver</option>
                                  <option value="Natural">Natural Titanium</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <select value={variant.storage} onChange={(e) => handleVariantChange(variant.id, 'storage', e.target.value)}>
                                  <option value="128GB">128 GB</option>
                                  <option value="256GB">256 GB</option>
                                  <option value="512GB">512 GB</option>
                                  <option value="1TB">1 TB</option>
                                </select>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <input type="text" placeholder="IPH16-BLK-128" value={variant.sku} onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)} style={{ width: '110px' }} />
                              </td>
                              <td style={{ padding: '8px' }}>
                                <input type="number" placeholder="999.00" value={variant.price} onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)} style={{ width: '80px' }} />
                              </td>
                              <td style={{ padding: '8px' }}>
                                <input type="number" placeholder="50" value={variant.stockLevel} onChange={(e) => handleVariantChange(variant.id, 'stockLevel', e.target.value)} style={{ width: '60px' }} />
                              </td>
                              <td style={{ padding: '8px' }}>
                                <select value={variant.variantImage} onChange={(e) => handleVariantChange(variant.id, 'variantImage', e.target.value)} style={{ width: '100px' }}>
                                  <option value="">Select Image</option>
                                  {uploadedImages.map((src, i) => (
                                    <option key={i} value={src}>Asset {i + 1}</option>
                                  ))}
                                </select>
                              </td>
                              <td style={{ padding: '8px' }}>
                                <button type="button" onClick={() => removeVariantRow(variant.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </section>

                  </div>
                </div>

                <footer className="fixed-action-footer">
                  <button type="button" onClick={handlePublish} className="btn-filled-primary">Publish</button>
                </footer>
              </div>
            )}

          </div>
        </main>
      </div>
    </>
  );
}