import React from 'react';

export default function AddProductInventory() {
  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>Cartigo</h1>
          <p>Enterprise Admin</p>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item" href="#dash"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
          <a className="admin-nav-item active" href="#inventory"><span className="material-symbols-outlined">inventory_2</span>Inventory</a>
          <a className="admin-nav-item" href="#analytics"><span className="material-symbols-outlined">insert_chart</span>Analytics</a>
        </nav>
      </aside>

      <main className="admin-main-view" style={{ marginBottom: '100px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
          <button className="icon-btn" style={{ border: '1px solid var(--outline-variant)' }}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h2 style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary)' }}>Add New Product</h2>
        </div>

        <div className="inventory-form-bento">
          {/* Left Form Block */}
          <div className="bento-column-main">
            <section className="inventory-card-section soft-elevation">
              <div className="inventory-section-header">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>info</span>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Basic Information</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="input-field-group">
                  <label>Product Title</label>
                  <input type="text" placeholder="e.g. Zenith Pro Wireless Headphones" style={{ padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: '8px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="input-field-group">
                    <label>Brand</label>
                    <select style={{ padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: '8px', background: 'none' }}>
                      <option>Zenith Original</option>
                    </select>
                  </div>
                  <div className="input-field-group">
                    <label>Category</label>
                    <select style={{ padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: '8px', background: 'none' }}>
                      <option>Electronics &gt; Audio</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            <section className="inventory-card-section soft-elevation">
              <div className="inventory-section-header">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>description</span>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Product Description</h3>
              </div>
              <div className="rich-editor-mockup-frame">
                <div className="editor-toolbar-row">
                  <button type="button" className="icon-btn" style={{ padding: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_bold</span></button>
                  <button type="button" className="icon-btn" style={{ padding: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_italic</span></button>
                  <button type="button" className="icon-btn" style={{ padding: '4px' }}><span className="material-symbols-outlined" style={{ fontSize: '20px' }}>format_list_bulleted</span></button>
                </div>
                <textarea rows="6" placeholder="Enter detailed product features, usage instructions, and benefits..."></textarea>
              </div>
            </section>

            <section className="inventory-card-section soft-elevation">
              <div className="inventory-section-header">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>list_alt</span>
                <h3 style={{ fontSize: '18px', fontWeight: '600' }}>Technical Specifications</h3>
              </div>
              <div className="specs-input-row">
                <input type="text" placeholder="Key (e.g. Battery Life)" />
                <input type="text" placeholder="Value (e.g. 24 Hours)" />
              </div>
              <div className="specs-input-row">
                <input type="text" placeholder="Key" />
                <input type="text" placeholder="Value" />
              </div>
            </section>
          </div>

          {/* Right Status Block */}
          <div className="bento-column-side">
            <section className="inventory-card-section soft-elevation">
              <div className="inventory-section-header">
                <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>visibility</span>
                <h3 style={{ fontSize: '16px', fontWeight: '600' }}>Product Status</h3>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px', marginBottom: '16px' }}>
                <span style={{ fontSize: '14px', fontWeight: '500' }}>Status</span>
                <span className="status-pill" style={{ backgroundColor: 'var(--secondary-container)', color: 'var(--on-surface)' }}>DRAFT</span>
              </div>
              <div className="input-field-group">
                <label>Visibility</label>
                <select style={{ padding: '12px', border: '1px solid var(--outline-variant)', borderRadius: '8px', background: 'none' }}>
                  <option>Online Store</option>
                  <option>B2B Marketplace</option>
                </select>
              </div>
            </section>
          </div>
        </div>

        {/* Fixed Dock Footer */}
        <footer className="sticky-action-dock-footer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--on-surface-variant)' }}>
            <span className="material-symbols-outlined">error_outline</span>
            <span style={{ fontSize: '14px' }}>Unsaved changes in basic configurations</span>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button className="outline-btn" style={{ padding: '12px 24px' }}>Save Draft</button>
            <button className="filled-btn" style={{ padding: '12px 32px' }}>Publish Product</button>
          </div>
        </footer>
      </main>
    </div>
  );
}