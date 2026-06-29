import React, { useState, useRef } from 'react';
import './ProductManagement.css'; 

import Header from '../../components/layout/Header/Header';

export default function ProductManagement() {
  // UI Panel State
  const [isBasicInfoOpen, setIsBasicInfoOpen] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const basicInfoRef = useRef(null);

  // Core Product Data State
  const [productForm, setProductForm] = useState({
    title: '',
    description: '',
    price: '',
    sku: 'ZNT-4402-PRO',
    stockLevel: 150,
    trackInventory: false,
    status: 'active',
    category: 'electronics-audio',
    brand: 'Zenith Pro',
    metaTitle: '',
    metaDescription: ''
  });

  // Dynamic Technical Specs Array
  const [specs, setSpecs] = useState([
    { id: 1, name: 'Weight', value: '320g' },
    { id: 2, name: 'Connectivity', value: 'Bluetooth 5.2, USB-C' }
  ]);

  // Media Storage
  const [uploadedImages, setUploadedImages] = useState([]);

  // Generic handler for flat inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Technical Specs Actions
  const handleSpecChange = (id, field, value) => {
    setSpecs(prev => prev.map(spec => spec.id === id ? { ...spec, [field]: value } : spec));
  };

  const addSpecAttribute = () => {
    setSpecs(prev => [...prev, { id: Date.now(), name: '', value: '' }]);
  };

  const deleteSpecAttribute = (id) => {
    setSpecs(prev => prev.filter(spec => spec.id !== id));
  };

  // Drag and Drop Logic
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newPreviews].slice(0, 4)); // Clamp to 4 slots
    }
  };

  const handlePublish = () => {
    const payload = { ...productForm, specifications: specs, images: uploadedImages };
    console.log('Publishing Payload to backend API:', payload);
  };

  return (
    <>
      <Header />
      
      <div className="page-container">
        {/* Sidebar Navigation Shell */}
        <aside className="sidebar-shell">
          <div className="mb-xl" style={{ marginBottom: '24px' }}>
           <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider" style={{ marginTop: '4px', fontSize: '12px' }}>Enterprise Admin</p>
          </div>
          <nav className="flex-grow space-y-sm" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a className="nav-link" href="#"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
            <a className="nav-link-active" href="#"><span className="material-symbols-outlined">inventory_2</span>Inventory</a>
          </nav>
        </aside>

        {/* Top AppBar Shell */}
        {/* <header className="top-appbar">
          <div className="flex items-center gap-md" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="relative" style={{ position: 'relative' }}>
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}>search</span>
              <input className="bg-surface-container-low border-none rounded-xl py-2 pl-10 pr-4 text-body-md" style={{ paddingLeft: '40px' }} placeholder="Search products..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-lg" style={{ display: 'flex', alignItems: 'center' }}>
            <div className="flex items-center gap-sm cursor-pointer group" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <div className="profile-avatar-container">
                {!avatarError ? (
                  <img 
                    alt="User Profile" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="profile-avatar-fallback" style={{ display: 'flex' }}>AU</div>
                )}
              </div>
              <span className="font-label-md text-label-md group-hover:text-primary transition-colors">Admin User</span>
            </div>
          </div>
        </header> */}

        {/* Main Content Canvas */}
        <main className="main-canvas">
          <div className="content-wrapper">
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'flex-end', marginBottom: '24px' }}>
              <div>
                <nav style={{ display: 'flex', gap: '8px', fontSize: '12px', marginBottom: '8px' }}>
                  <a className="hover:text-primary" href="#" style={{ textDecoration: 'none', color: 'inherit' }}>Catalog</a>
                  <span>/</span>
                  <span className="text-primary">New Product</span>
                </nav>
                <h2 style={{ margin: 0, fontSize: '28px' }}>Add New Product</h2>
              </div>
            </div>

            <div className="layout-grid">
              {/* Left Column */}
              <div className="col-main">
                
                {/* Basic Info Card */}
                <section className="bento-card-section">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: '16px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '20px' }}>
                      <span className="material-symbols-outlined text-primary">info</span>Basic Information
                    </h3>
                    <button style={{ background: 'transparent', border: 'none', cursor: 'pointer' }} onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}>
                      <span className={`material-symbols-outlined icon-toggle-rotate ${isBasicInfoOpen ? '' : 'rotate-icon'}`}>
                        keyboard_arrow_up
                      </span>
                    </button>
                  </div>
                  
                  <div 
                    ref={basicInfoRef}
                    className={`section-collapse-content ${isBasicInfoOpen ? 'section-open' : ''}`}
                    style={isBasicInfoOpen ? { '--scroll-height': `${basicInfoRef.current?.scrollHeight}px` } : null}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label className="form-label">PRODUCT TITLE</label>
                        <input name="title" value={productForm.title} onChange={handleInputChange} className="form-input" placeholder="e.g. Zenith Pro Wireless Headphones" type="text" />
                      </div>
                      <div>
                        <label className="form-label">DESCRIPTION</label>
                        <div className="text-editor-container">
                          <textarea name="description" value={productForm.description} onChange={handleInputChange} className="text-editor-textarea" placeholder="Specifications copy..." rows="6"></textarea>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Media Gallery */}
                <section className="bento-card-section">
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Media Gallery</h3>
                  <div className="media-grid">
                    <div 
                      className={`drag-upload-zone ${isDragging ? 'bg-dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      style={isDragging ? { borderColor: 'var(--primary)' } : {}}
                    >
                      <span className="material-symbols-outlined upload-icon-size">cloud_upload</span>
                      <p className="font-body-sm text-center" style={{ margin: '8px 0 0 0' }}>Drag files here</p>
                    </div>

                    {/* Pre-calculated 4 Image Preview Grids */}
                    {[0, 1, 2, 3].map((index) => (
                      <div key={index} style={{ border: '1px solid var(--outline-variant)', borderRadius: 'var(--radius-xl)', aspectRatio: '1/1', backgroundColor: 'var(--surface-container-low)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                        {uploadedImages[index] ? (
                          <img style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} src={uploadedImages[index]} alt="Preview" />
                        ) : (
                          <span className="material-symbols-outlined text-outline">add</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pricing & Stock */}
                <div className="grid-half">
                  <section className="bento-card-section">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Pricing</h3>
                    <input name="price" value={productForm.price} onChange={handleInputChange} className="form-input" placeholder="0.00" type="number" />
                  </section>
                  <section className="bento-card-section">
                    <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Stock Level</h3>
                    <input name="stockLevel" value={productForm.stockLevel} onChange={handleInputChange} className="form-input" type="number" />
                  </section>
                </div>

                {/* Technical Specs Table */}
                <section className="bento-card-table-section">
                  <div style={{ padding: '16px', borderBottom: '1px solid var(--outline-variant)', display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                    <h3 style={{ margin: 0, fontSize: '20px' }}>Technical Specifications</h3>
                    <button type="button" onClick={addSpecAttribute} className="btn-icon-interactive" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '14px', fontWeight: 500 }}>
                      <span className="material-symbols-outlined add-attribute-icon-size">add_circle</span> Add Attribute
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {specs.map((spec) => (
                        <tr key={spec.id} style={{ borderBottom: '1px solid var(--outline-variant)' }}>
                          <td style={{ padding: '12px 16px' }}>
                            <input value={spec.name} onChange={(e) => handleSpecChange(spec.id, 'name', e.target.value)} className="bg-transparent" style={{ border: 'none', width: '100%', outline: 'none' }} type="text" placeholder="Attribute" />
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <input value={spec.value} onChange={(e) => handleSpecChange(spec.id, 'value', e.target.value)} className="bg-transparent" style={{ border: 'none', width: '100%', outline: 'none' }} type="text" placeholder="Value" />
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <span onClick={() => deleteSpecAttribute(spec.id)} className="material-symbols-outlined text-outline cursor-pointer" style={{ cursor: 'pointer' }}>delete</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>

              {/* Right Column Options */}
              <div className="col-side">
                <section className="bento-card-section">
                  <h3 style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Product Status</h3>
                  <select name="status" value={productForm.status} onChange={handleInputChange} className="form-select">
                    <option value="draft">Draft (Private)</option>
                    <option value="active">Active (Published)</option>
                  </select>
                </section>
              </div>
            </div>
          </div>
        </main>

        {/* Footer actions */}
        <footer className="fixed-action-footer">
          <button type="button" className="btn-outline-primary">Save Draft</button>
          <button type="button" onClick={handlePublish} className="btn-filled-primary">Publish Product</button>
        </footer>
      </div>
    </>
  );
}