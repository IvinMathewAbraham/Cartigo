import React, { useState } from 'react';

export default function SupportTickets() {
  const [layoutMode, setLayoutMode] = useState('list'); // 'list' | 'grid'
  
  const ticketsMock = [
    { id: 'ZN-84021', title: 'Issue with Seller Disbursement #4401', category: 'shopping_cart', status: 'Open', date: 'Oct 24, 2024', activeState: 'Last activity 2h ago' },
    { id: 'ZN-83955', title: 'Two-Factor Authentication Recovery Request', category: 'security', status: 'Pending', date: 'Oct 22, 2024', activeState: 'Last activity yesterday' },
    { id: 'ZN-83102', title: 'API Documentation Feedback - Marketplace V3', category: 'check_circle', status: 'Resolved', date: 'Oct 15, 2024', activeState: 'Closed 3 days ago' }
  ];

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>Cartigo Support</h1>
          <p>Enterprise Desk</p>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item" href="#home"><span className="material-symbols-outlined">home</span>Home</a>
          <a className="admin-nav-item active" href="#tickets"><span className="material-symbols-outlined">confirmation_number</span>My Tickets</a>
        </nav>
      </aside>

      <main className="admin-main-view">
        <header className="dashboard-header-flex">
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700' }}>Support Dashboard</h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>Track and manage your marketplace inquiries.</p>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div className="view-toggle-frame">
              <button className={`toggle-action-btn ${layoutMode === 'list' ? 'active' : ''}`} onClick={() => setLayoutMode('list')}>
                <span className="material-symbols-outlined">list</span>List
              </button>
              <button className={`toggle-action-btn ${layoutMode === 'grid' ? 'active' : ''}`} onClick={() => setLayoutMode('grid')}>
                <span className="material-symbols-outlined">grid_view</span>Grid
              </button>
            </div>
            <button className="filled-btn" style={{ padding: '12px 24px' }}>New Ticket</button>
          </div>
        </header>

        {/* Filters and Stats Bento Wrapper */}
        <div className="bento-filter-strip">
          <div className="filter-control-panel soft-elevation">
            <div className="filter-select-group">
              <label>Status Filter</label>
              <select><option>All Statuses</option><option>Open</option></select>
            </div>
            <div className="filter-select-group">
              <label>Timeframe</label>
              <select><option>Last 30 days</option></select>
            </div>
          </div>
          <div className="bento-stat-highlight soft-elevation">
            <div>
              <p style={{ fontSize: '12px', opacity: 0.8, textTransform: 'uppercase' }}>Active Inquiries</p>
              <p style={{ fontSize: '32px', fontWeight: '700' }}>04</p>
            </div>
            <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>confirmation_number</span>
          </div>
        </div>

        {/* Content Stream Stream */}
        <div className={`ticket-stream-canvas ${layoutMode === 'grid' ? 'grid-layout' : ''}`}>
          {ticketsMock.map((ticket) => (
            <div key={ticket.id} className="ticket-list-item-card soft-elevation" style={{ flexDirection: layoutMode === 'grid' ? 'column' : 'row', alignItems: layoutMode === 'grid' ? 'start' : 'center', gap: '16px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'start' }}>
                <div style={{ padding: '12px', backgroundColor: 'var(--surface-container-low)', borderRadius: '8px' }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>{ticket.category}</span>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--outline)', fontWeight: '600' }}>{ticket.id}</span>
                    <span className={`ticket-tag-pill ${ticket.status.toLowerCase()}`}>{ticket.status}</span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600' }}>{ticket.title}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--on-surface-variant)', marginTop: '4px' }}>
                    {ticket.date} • {ticket.activeState}
                  </p>
                </div>
              </div>
              <button className="outline-btn" style={{ padding: '8px 16px', fontSize: '14px' }}>View Details</button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}