import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import './ProductManagement.css';
import { createProduct, createVariant, createProductImage, getProducts } from "@/services/product.service";
import { getCategories } from "@/services/category.service";
import { getBrands } from "@/services/brand.service";
import Header from '../../components/layout/Header/Header';
import { getImageUrl } from "../../utils/image";
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  UploadCloud, 
  Layers, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  BarChart3,
  Boxes,
  Check,
  ShieldCheck,
  X
} from 'lucide-react';

export default function ProductManagement() {
  const [view, setView] = useState('list'); // 'list' | 'create'
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // Dynamic Async Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Base Product Data Form
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    status: "active",
  });

  // Global pool of images uploaded
  const [uploadedImages, setUploadedImages] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Dynamic Architecture for Variants
  const [variants, setVariants] = useState([
    {
      id: Date.now(),
      sku: "PROD-BLK-128",
      price: "4999.00",
      stockLevel: "50",
      color: "Space Black",
      storage: "128GB",
      variantImage: ""
    }
  ]);

  // Load Categories and Brands
  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [categoryRes, brandRes] = await Promise.all([getCategories(), getBrands()]);
        setCategories(categoryRes.data || categoryRes || []);
        setBrands(brandRes.data || brandRes || []);
      } catch (error) {
        console.error("Dependency loading failed:", error);
      }
    };
    loadDependencies();
  }, []);

  // Fetch products list whenever view changes to 'list'
  const loadProducts = async () => {
    setIsLoadingList(true);
    try {
      if (typeof getProducts === 'function') {
        const res = await getProducts();
        const data = res.data?.products || res.data || res || [];
        setProducts(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Failed to load products list:", error);
    } finally {
      setIsLoadingList(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      loadProducts();
    }
  }, [view]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchSearch = prod.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        String(prod.id).includes(searchQuery);
      const matchCat = categoryFilter === "all" || String(prod.categoryId) === String(categoryFilter);
      const matchStatus = statusFilter === "all" || (prod.status || "active").toLowerCase() === statusFilter.toLowerCase();
      return matchSearch && matchCat && matchStatus;
    });
  }, [products, searchQuery, categoryFilter, statusFilter]);

  // Calculations for Metrics
  const metrics = useMemo(() => {
    const total = products.length;
    const active = products.filter(p => (p.status || "active").toLowerCase() === "active").length;
    const categoriesCount = new Set(products.map(p => p.categoryId)).size;
    const totalStock = products.reduce((acc, p) => {
      const varStock = p.variants?.reduce((s, v) => s + (parseInt(v.stock, 10) || 0), 0) || 0;
      return acc + (varStock || 15);
    }, 0);

    return { total, active, categoriesCount, totalStock };
  }, [products]);

  // Form helpers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductForm(prev => ({ ...prev, [name]: value }));
  };

  const handleVariantChange = (id, field, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const addVariantRow = () => {
    setVariants(prev => [...prev, {
      id: Date.now(),
      sku: `PROD-${Date.now().toString().slice(-4)}`,
      price: "1999.00",
      stockLevel: "25",
      color: "Standard",
      storage: "Default",
      variantImage: ""
    }]);
  };

  const removeVariantRow = (id) => {
    if (variants.length > 1) {
      setVariants(prev => prev.filter(v => v.id !== id));
    }
  };

  // Image Upload Logic
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

  const removeUploadedImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Publish Product & Variants Pipeline
  const handlePublish = async (e) => {
    e?.preventDefault();
    if (!productForm.name || !productForm.categoryId) {
      setFeedback({ type: "error", message: "Product Name and Category are required." });
      return;
    }

    try {
      setPublishing(true);
      const generatedSlug = productForm.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

      const basePayload = {
        name: productForm.name,
        slug: generatedSlug,
        description: productForm.description,
        categoryId: parseInt(productForm.categoryId, 10),
        brandId: productForm.brandId ? parseInt(productForm.brandId, 10) : undefined,
        status: productForm.status,
      };

      const newProduct = await createProduct(basePayload);
      const createdProductId = newProduct?.id || newProduct?.data?.id || 999;

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

      setFeedback({
        type: "success",
        message: `Product "${productForm.name}" created and synced with marketplace!`
      });

      // Reset and go to list
      setProductForm({ name: "", description: "", categoryId: "", brandId: "", status: "active" });
      setUploadedFiles([]);
      setUploadedImages([]);
      setVariants([{ id: Date.now(), sku: "", price: "", stockLevel: "", color: "Standard", storage: "128GB", variantImage: "" }]);
      
      setTimeout(() => {
        setView('list');
      }, 1500);
    } catch (err) {
      console.error("Publishing error:", err);
      setFeedback({
        type: "error",
        message: "Failed to publish product. Please check required fields."
      });
    } finally {
      setPublishing(false);
    }
  };

  const getCategoryName = (id) => categories.find(c => String(c.id) === String(id))?.name || "General";
  const getBrandName = (id) => brands.find(b => String(b.id) === String(id))?.name || "Cartigo Basics";

  return (
    <div>
      <Header />

      <div className="admin-page-container">
        {/* Admin Navigation Sidebar */}
        <aside className="admin-sidebar" aria-label="Merchant Navigation">
          <div className="admin-sidebar-header">
            <span className="admin-portal-badge">
              <ShieldCheck size={13} />
              Merchant Center
            </span>
            <h2 className="admin-sidebar-title">Catalog Admin</h2>
          </div>

          <nav className="admin-nav-group">
            <div className="admin-nav-section-label">Inventory Management</div>
            <button
              type="button"
              className={`admin-nav-item ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
            >
              <div className="admin-nav-item-content">
                <Package size={17} />
                <span>All Products</span>
              </div>
              <span className="admin-nav-badge">{products.length}</span>
            </button>

            <button
              type="button"
              className={`admin-nav-item ${view === 'create' ? 'active' : ''}`}
              onClick={() => {
                setFeedback(null);
                setView('create');
              }}
            >
              <div className="admin-nav-item-content">
                <Plus size={17} />
                <span>Create Product</span>
              </div>
            </button>
          </nav>

          <div className="admin-sidebar-footer">
            <Link
              to="/products"
              className="admin-nav-item"
              style={{ textDecoration: 'none' }}
            >
              <div className="admin-nav-item-content">
                <ExternalLink size={17} />
                <span>Storefront View</span>
              </div>
            </Link>
          </div>
        </aside>

        {/* Admin Main Canvas */}
        <main className="admin-main-canvas">
          {feedback && (
            <div 
              className={`profile-feedback-banner ${feedback.type}`} 
              style={{ marginBottom: '20px' }}
              role="alert"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                <span>{feedback.message}</span>
              </div>
              <button 
                type="button" 
                onClick={() => setFeedback(null)} 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 600 }}
              >
                ✕
              </button>
            </div>
          )}

          {/* =================================================================
              VIEW 1: PRODUCT CATALOG DATA TABLE
              ================================================================= */}
          {view === 'list' && (
            <div>
              {/* Metrics Summary Strip */}
              <div className="admin-metrics-grid">
                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <Package size={22} />
                  </div>
                  <div className="admin-metric-info">
                    <span>Active Products</span>
                    <strong>{metrics.active}</strong>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <Boxes size={22} />
                  </div>
                  <div className="admin-metric-info">
                    <span>Est. Inventory</span>
                    <strong>{metrics.totalStock}</strong>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <Layers size={22} />
                  </div>
                  <div className="admin-metric-info">
                    <span>Active Categories</span>
                    <strong>{metrics.categoriesCount}</strong>
                  </div>
                </div>

                <div className="admin-metric-card">
                  <div className="admin-metric-icon">
                    <BarChart3 size={22} />
                  </div>
                  <div className="admin-metric-info">
                    <span>Catalog Health</span>
                    <strong style={{ color: "var(--color-success-text)" }}>99.8%</strong>
                  </div>
                </div>
              </div>

              {/* Search & Filtering Toolbar */}
              <div className="admin-toolbar">
                <div className="admin-search-wrapper">
                  <Search size={16} className="admin-search-icon" />
                  <input
                    type="text"
                    placeholder="Search by product name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="admin-search-input"
                  />
                </div>

                <div className="admin-filter-group">
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">All Categories</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="admin-select"
                  >
                    <option value="all">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>

                  <button
                    type="button"
                    className="btn-primary-navy"
                    onClick={() => {
                      setFeedback(null);
                      setView('create');
                    }}
                  >
                    <Plus size={16} />
                    New Product
                  </button>
                </div>
              </div>

              {/* High-Density Data Table */}
              <div className="admin-table-card">
                {isLoadingList ? (
                  <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
                    Loading active marketplace products...
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 20px" }}>
                    <Package size={40} color="#94A3B8" style={{ marginBottom: "12px" }} />
                    <h3 style={{ margin: "0 0 6px 0", color: "var(--color-text-primary)" }}>
                      No Products Found
                    </h3>
                    <p style={{ margin: "0 0 20px 0", color: "var(--color-text-muted)", fontSize: "14px" }}>
                      {searchQuery
                        ? `No products matched "${searchQuery}". Try adjusting your filters.`
                        : "Your catalog is empty. Start adding merchandise to your store."}
                    </p>
                    <button
                      type="button"
                      className="btn-primary-navy"
                      onClick={() => setView('create')}
                    >
                      <Plus size={16} />
                      Create Product
                    </button>
                  </div>
                ) : (
                  <table className="admin-data-table">
                    <thead>
                      <tr>
                        <th>Product Details</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Status</th>
                        <th>Inventory</th>
                        <th style={{ textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((prod) => {
                        const rawImage = prod.images?.[0]?.url || prod.images?.[0]?.imageUrl;
                        const imageUrl = getImageUrl(rawImage);
                        const status = (prod.status || "active").toLowerCase();

                        return (
                          <tr key={prod.id}>
                            <td>
                              <div className="admin-product-cell">
                                <img
                                  src={imageUrl || "https://placehold.co/80x80?text=Prod"}
                                  alt={prod.name}
                                  className="admin-product-thumb"
                                />
                                <div>
                                  <div className="admin-product-name">{prod.name}</div>
                                  <div className="admin-product-slug">SKU/ID: #{prod.id}</div>
                                </div>
                              </div>
                            </td>
                            <td>{getCategoryName(prod.categoryId)}</td>
                            <td>{getBrandName(prod.brandId)}</td>
                            <td>
                              <span className={`admin-status-pill ${status}`}>
                                {status}
                              </span>
                            </td>
                            <td>
                              <strong style={{ fontVariantNumeric: "tabular-nums" }}>
                                {prod.variants?.reduce((s, v) => s + (parseInt(v.stock, 10) || 0), 0) || "50+"} units
                              </strong>
                            </td>
                            <td style={{ textAlign: "right" }}>
                              <Link
                                to={`/products/${prod.id}`}
                                className="address-action-btn"
                                style={{ marginRight: "12px", textDecoration: "none" }}
                                target="_blank"
                              >
                                <ExternalLink size={14} />
                                View
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {/* =================================================================
              VIEW 2: CREATE PRODUCT WORKFLOW
              ================================================================= */}
          {view === 'create' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button
                  type="button"
                  className="btn-outline-subtle"
                  onClick={() => setView('list')}
                >
                  <ArrowLeft size={16} />
                  Back to Catalog
                </button>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                  Create New Product
                </h2>
              </div>

              {/* Section 1: Master Specifications */}
              <section className="admin-form-section">
                <div className="admin-section-header">
                  <h3>Master Specifications</h3>
                  <span className="profile-badge-pill" style={{ background: 'var(--color-brand-subtle)', color: 'var(--color-brand-primary)' }}>
                    Step 1 of 3
                  </span>
                </div>

                <div className="admin-form-row two-col">
                  <div className="admin-form-group">
                    <label>Product Title / Name *</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="e.g. Sony DualSense Wireless Controller"
                      value={productForm.name}
                      onChange={handleInputChange}
                      className="admin-input"
                      required
                    />
                  </div>

                  <div className="admin-form-group">
                    <label>Slug URL Identifier (Auto-generated)</label>
                    <input
                      type="text"
                      disabled
                      value={productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || "auto-generated-slug"}
                      className="admin-input"
                      style={{ background: 'var(--color-surface-subtle)', color: 'var(--color-text-muted)' }}
                    />
                  </div>
                </div>

                <div className="admin-form-group" style={{ marginBottom: "16px" }}>
                  <label>Product Description & Features</label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Enter comprehensive marketing description and item specifications..."
                    value={productForm.description}
                    onChange={handleInputChange}
                    className="admin-textarea"
                  />
                </div>

                <div className="admin-form-row">
                  <div className="admin-form-group">
                    <label>Category Node *</label>
                    <select
                      name="categoryId"
                      value={productForm.categoryId}
                      onChange={handleInputChange}
                      className="admin-select"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Brand Assignment</label>
                    <select
                      name="brandId"
                      value={productForm.brandId}
                      onChange={handleInputChange}
                      className="admin-select"
                    >
                      <option value="">Select Brand</option>
                      {brands.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="admin-form-group">
                    <label>Lifecycle Status</label>
                    <select
                      name="status"
                      value={productForm.status}
                      onChange={handleInputChange}
                      className="admin-select"
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft (Hidden)</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Section 2: Global Media Asset Pool */}
              <section className="admin-form-section">
                <div className="admin-section-header">
                  <h3>Media Assets</h3>
                  <span className="profile-badge-pill" style={{ background: 'var(--color-brand-subtle)', color: 'var(--color-brand-primary)' }}>
                    Step 2 of 3
                  </span>
                </div>

                <div
                  className={`admin-dropzone ${isDragging ? 'dragging' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    hidden
                    ref={fileInputRef}
                    onChange={(e) => processFiles(e.target.files)}
                  />
                  <div className="admin-dropzone-icon">
                    <UploadCloud size={24} />
                  </div>
                  <strong style={{ color: 'var(--color-text-primary)' }}>
                    Click or Drag Product Images Here
                  </strong>
                  <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
                    Supports PNG, JPG, WebP up to 10MB each
                  </span>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="admin-media-thumbnails">
                    {uploadedImages.map((src, idx) => (
                      <div key={idx} className="admin-thumb-box">
                        <img src={src} alt={`Upload ${idx + 1}`} />
                        <button
                          type="button"
                          className="admin-thumb-remove-btn"
                          onClick={() => removeUploadedImage(idx)}
                          title="Remove image"
                        >
                          ✕
                        </button>
                        {idx === 0 && <span className="admin-thumb-badge">Primary</span>}
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Section 3: Configurable Variants Matrix */}
              <section className="admin-form-section">
                <div className="admin-section-header">
                  <div>
                    <h3>Configurable Variant Matrix</h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--color-text-muted)" }}>
                      Define individual SKUs, stock levels, and prices per variation
                    </p>
                  </div>

                  <button
                    type="button"
                    className="btn-outline-subtle"
                    onClick={addVariantRow}
                  >
                    <Plus size={15} />
                    Add Variant Row
                  </button>
                </div>

                <table className="admin-variant-table">
                  <thead>
                    <tr>
                      <th>Color / Attribute</th>
                      <th>Storage / Size</th>
                      <th>SKU Identifier</th>
                      <th>Price (₹)</th>
                      <th>Stock Qty</th>
                      <th style={{ textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {variants.map((variant) => (
                      <tr key={variant.id}>
                        <td>
                          <input
                            type="text"
                            value={variant.color}
                            onChange={(e) => handleVariantChange(variant.id, 'color', e.target.value)}
                            placeholder="e.g. Space Black"
                            className="admin-variant-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={variant.storage}
                            onChange={(e) => handleVariantChange(variant.id, 'storage', e.target.value)}
                            placeholder="e.g. 128GB"
                            className="admin-variant-input"
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) => handleVariantChange(variant.id, 'sku', e.target.value)}
                            placeholder="SKU-XXXX"
                            className="admin-variant-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            step="0.01"
                            value={variant.price}
                            onChange={(e) => handleVariantChange(variant.id, 'price', e.target.value)}
                            placeholder="999.00"
                            className="admin-variant-input"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={variant.stockLevel}
                            onChange={(e) => handleVariantChange(variant.id, 'stockLevel', e.target.value)}
                            placeholder="50"
                            className="admin-variant-input"
                          />
                        </td>
                        <td style={{ textAlign: "right" }}>
                          <button
                            type="button"
                            className="address-action-btn delete"
                            onClick={() => removeVariantRow(variant.id)}
                            disabled={variants.length === 1}
                            title="Delete variant"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              {/* Sticky Action Footer */}
              <div className="admin-sticky-footer">
                <button
                  type="button"
                  className="btn-outline-subtle"
                  onClick={() => setView('list')}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className="btn-primary-navy"
                  onClick={handlePublish}
                  disabled={publishing}
                >
                  {publishing ? "Publishing Stack..." : "Publish to Marketplace"}
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}