import React, { useState, useRef } from 'react';
import './ProductManagement.css'; 

import Header from '../../components/layout/Header/Header';
import Footer from '../../components/layout/Footer/Footer';

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
      // Map files to local object URLs for display previews
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setUploadedImages(prev => [...prev, ...newPreviews].slice(0, 4)); // clamp to 4 slots
    }
  };

  const handlePublish = () => {
    const payload = { ...productForm, specifications: specs, images: uploadedImages };
    console.log('Publishing Payload to backend API:', payload);
    // Execute fetch/axios call here
  };

  return (
    <>
      <Header />
      
      <div className="page-container">
        {/* Sidebar Navigation Shell */}
        <aside className="sidebar-shell">
          <div className="mb-xl">
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Cartigo</h1>
            <p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Enterprise Admin</p>
          </div>
          <nav className="flex-grow space-y-sm">
            <a className="nav-link" href="#"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
            <a className="nav-link-active" href="#"><span className="material-symbols-outlined">inventory_2</span>Inventory</a>
          </nav>
        </aside>

        {/* Top AppBar Shell */}
        <header className="top-appbar">
          <div className="flex items-center gap-md">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input className="bg-surface-container-low border-none rounded-xl py-2 pl-10 pr-4 text-body-md focus:ring-2 focus:ring-primary/20 w-80" placeholder="Search products..." type="text" />
            </div>
          </div>
          <div className="flex items-center gap-lg">
            <div className="flex items-center gap-sm cursor-pointer group">
              <div className="profile-avatar-container">
                {!avatarError ? (
                  <img 
                    alt="User Profile" 
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" 
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <div className="profile-avatar-fallback">AU</div>
                )}
              </div>
              <span className="font-label-md text-label-md group-hover:text-primary transition-colors">Admin User</span>
            </div>
          </div>
        </header>

        {/* Main Content Canvas */}
        <main className="main-canvas">
          <div className="content-wrapper">
            <div className="flex justify-between items-end mb-xl">
              <div>
                <nav className="flex gap-sm text-label-md font-label-md text-on-surface-variant mb-sm">
                  <a className="hover:text-primary" href="#">Catalog</a>
                  <span>/</span>
                  <span className="text-primary">New Product</span>
                </nav>
                <h2 className="font-display text-display">Add New Product</h2>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-lg">
              {/* Left Column */}
              <div className="col-span-8 space-y-lg">
                
                {/* Basic Info Card */}
                <section className="bento-card-section">
                  <div className="flex items-center justify-between mb-lg">
                    <h3 className="font-headline-sm text-headline-sm flex items-center gap-sm">
                      <span className="material-symbols-outlined text-primary">info</span>Basic Information
                    </h3>
                    <button className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none" onClick={() => setIsBasicInfoOpen(!isBasicInfoOpen)}>
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
                    <div className="space-y-lg">
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
                  <h3 className="font-headline-sm text-headline-sm mb-lg">Media Gallery</h3>
                  <div className="grid grid-cols-4 gap-md">
                    <div 
                      className={`drag-upload-zone ${isDragging ? 'bg-dragging border-primary' : 'border-outline-variant'}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <span className="material-symbols-outlined">cloud_upload</span>
                      <p className="font-body-sm text-center">Drag files here</p>
                    </div>

                    {/* Render Image previews or placeholders */}
                    {[0, 1, 2].map((index) => (
                      <div key={index} className="border border-outline-variant rounded-xl aspect-square bg-surface-container-low flex items-center justify-center relative overflow-hidden">
                        {uploadedImages[index] ? (
                          <img className="absolute inset-0 w-full h-full object-cover" src={uploadedImages[index]} alt="Preview" />
                        ) : (
                          <span className="material-symbols-outlined text-outline">add</span>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Pricing & Stock */}
                <div className="grid grid-cols-2 gap-lg">
                  <section className="bento-card-section">
                    <h3 className="font-headline-sm text-headline-sm mb-lg">Pricing</h3>
                    <input name="price" value={productForm.price} onChange={handleInputChange} className="form-input" placeholder="0.00" type="number" />
                  </section>
                  <section className="bento-card-section">
                    <h3 className="font-headline-sm text-headline-sm mb-lg">Stock Level</h3>
                    <input name="stockLevel" value={productForm.stockLevel} onChange={handleInputChange} className="form-input" type="number" />
                  </section>
                </div>

                {/* Technical Specs Table */}
                <section className="bento-card-table-section">
                  <div className="p-lg border-b border-outline-variant flex justify-between items-center">
                    <h3 className="font-headline-sm text-headline-sm">Technical Specifications</h3>
                    <button type="button" onClick={addSpecAttribute} className="flex items-center gap-xs text-primary font-label-md hover:underline">
                      <span className="material-symbols-outlined">add_circle</span> Add Attribute
                    </button>
                  </div>
                  <table className="w-full text-left border-collapse">
                    <tbody className="divide-y divide-outline-variant">
                      {specs.map((spec) => (
                        <tr key={spec.id} className="hover:bg-surface-container-low/50 transition-colors">
                          <td className="px-lg py-md">
                            <input value={spec.name} onChange={(e) => handleSpecChange(spec.id, 'name', e.target.value)} className="bg-transparent border-none w-full outline-none" type="text" placeholder="Attribute" />
                          </td>
                          <td className="px-lg py-md">
                            <input value={spec.value} onChange={(e) => handleSpecChange(spec.id, 'value', e.target.value)} className="bg-transparent border-none w-full outline-none" type="text" placeholder="Value" />
                          </td>
                          <td className="px-lg py-md text-right">
                            <span onClick={() => deleteSpecAttribute(spec.id)} className="material-symbols-outlined text-outline cursor-pointer hover:text-error">delete</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>

              {/* Right Column Options */}
              <div className="col-span-4 space-y-lg">
                <section className="bento-card-section">
                  <h3 className="font-headline-sm text-headline-sm mb-lg">Product Status</h3>
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
      <Footer/>
    </>
  );
}