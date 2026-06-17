import React, { useState } from 'react';

export default function RolePermissions() {
  const [selectedRole, setSelectedRole] = useState('Admin');

  const matrixMock = [
    { category: 'User Accounts', desc: 'Manage profiles and login credentials', icon: 'person' },
    { category: 'Product Inventory', desc: 'Stock levels, pricing, and catalog', icon: 'inventory_2' },
    { category: 'Order Management', desc: 'Customer orders and fulfillment', icon: 'shopping_cart' },
    { category: 'Financial Reporting', desc: 'Revenue logs and payout processing', icon: 'payments' }
  ];

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>AdminConsole</h1>
          <p>Access Control</p>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item" href="#users"><span className="material-symbols-outlined">group</span>Users</a>
          <a className="admin-nav-item active" href="#roles"><span className="material-symbols-outlined">security</span>Permissions Matrix</a>
        </nav>
      </aside>

      <main className="admin-main-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>Role &amp; Permissions</h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>Configure access levels and resource management across the enterprise.</p>
          </div>
          <button className="filled-btn" style={{ padding: '12px 24px' }}>Create New Role</button>
        </div>

        <div className="role-matrix-bento">
          {/* Left Side Available Roles Node Stack */}
          <div className="matrix-sidebar-card soft-elevation">
            <div style={{ padding: '16px', backgroundColor: 'var(--surface-container-low)', borderBottom: '1px solid var(--outline-variant)' }}>
              <h4 style={{ fontWeight: '600' }}>Available System Roles</h4>
            </div>
            <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Administrator', 'Editor', 'Support Agent', 'Viewer'].map((role) => (
                <div 
                  key={role} 
                  className={`role-selection-node ${selectedRole === role ? 'active' : ''}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div style={{ fontWeight: '600', fontSize: '14px' }}>{role}</div>
                  <p style={{ fontSize: '11px', marginTop: '2px' }}>Access rules configuration token</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side Matrix Configuration Panel */}
          <div className="matrix-grid-card soft-elevation">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--outline-variant)' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--primary)' }}>{selectedRole} Matrix</h3>
              <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>Global system permissions for high-level administration.</p>
            </div>

            <div style={{ flexGrow: 1, overflowY: 'auto' }}>
              <table className="enterprise-table">
                <thead>
                  <tr>
                    <th>Permission Scope</th>
                    <th style={{ textAlign: 'center' }}>View</th>
                    <th style={{ textAlign: 'center' }}>Create</th>
                    <th style={{ textAlign: 'center' }}>Edit</th>
                    <th style={{ textAlign: 'center' }}>Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {matrixMock.map((row, index) => (
                    <tr key={index}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', backgroundColor: 'var(--surface-container-high)', borderRadius: '6px' }}>
                            <span className="material-symbols-outlined">{row.icon}</span>
                          </div>
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>{row.category}</div>
                            <div style={{ fontSize: '11px', color: 'var(--outline)' }}>{row.desc}</div>
                          </div>
                        </div>
                      </td>
                      {['v', 'c', 'e', 'd'].map((action) => (
                        <td key={action} style={{ textAlign: 'center' }}>
                          <label className="matrix-switch-container">
                            <input type="checkbox" defaultChecked={selectedRole === 'Administrator'} />
                            <span className="matrix-switch-slider"></span>
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}