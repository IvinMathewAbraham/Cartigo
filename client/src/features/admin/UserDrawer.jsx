import React from 'react';

export default function UserDrawer({ selectedUser, isOpen, onClose }) {
  if (!isOpen || !selectedUser) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="slideover-drawer-canvas" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header-block">
          <h3>User Details</h3>
          <button className="icon-btn" onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="drawer-scroll-body">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px' }}>
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <img src={selectedUser.avatar} alt="User Avatar" style={{ width: '112px', height: '112px', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: '600' }}>{selectedUser.name}</h4>
            <p style={{ fontSize: '14px', color: 'var(--on-surface-variant)' }}>{selectedUser.role} • Product Ops</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <h5 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px' }}>Contact Information</h5>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '16px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--outline)' }}>Email</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.email}</p>
                </div>
                <div style={{ backgroundColor: 'var(--surface-container-low)', padding: '16px', borderRadius: '8px' }}>
                  <p style={{ fontSize: '11px', color: 'var(--outline)' }}>Phone</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>+1 (555) 012-3456</p>
                </div>
              </div>
            </div>

            <div>
              <h5 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--on-surface-variant)', textTransform: 'uppercase', marginBottom: '8px' }}>Account Status</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--surface-container-low)', padding: '16px', borderRadius: '8px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: 'var(--outline)' }}>Last Login</p>
                  <p style={{ fontSize: '14px', fontWeight: '600' }}>{selectedUser.lastLogin} (San Francisco, CA)</p>
                </div>
                <span className="status-pill active">Active</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ padding: '24px', backgroundColor: 'var(--surface-container-low)', display: 'flex', gap: '16px' }}>
          <button className="outline-btn" style={{ flex: 1, padding: '12px' }} onClick={onClose}>Disable User</button>
          <button className="filled-btn" style={{ flex: 1, padding: '12px' }}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}