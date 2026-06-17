import React, { useState } from 'react';
import UserDrawer from './UserDrawer';

export default function AdminUserManagement() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const usersMock = [
    { id: '002149', name: 'Alex Rivera', email: 'alex.rivera@corp.com', role: 'Product Lead', status: 'Active', lastLogin: '2 hours ago', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBu-XFL-ftPlVq_Rl2KJmcTf7N1D01wqB4Pt_DeNRN9m8fVgPUMDQTYrgccMVjDwhKORMsDOxH9RYODzyDpru2aWCmXt7RveABhIoYB44xsC2CfL2PJFbb13PVx0IBwdvsINEASFkO-r8Tg_Ud9RGxEAJQPVmEQea_1IwEZatzhxO8oOF2kBVswWvNdfJneSMtijPb7K9e7U7AQg6-7NfrpvAfWCI5aAJ2VqA4gYjb5SkKdxOYnFSSGLFsOeiPrYIfNvtJnaI01bBU' },
    { id: '002352', name: 'Sarah Chen', email: 's.chen@corp.com', role: 'System Architect', status: 'Active', lastLogin: 'Yesterday', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC75JmiOhFATzZ-aLizaO1-l6UW4VT_G3QXc52DV94CmuRlPiCaVKndN3zEJD6WY41GfvqpnweBxHLCLGmdI0lVJ5Cwrs3st_hJvHDzGAa60Mo8nNw158uivKFi_7_Bm9eWLi0ml0XlCO_bfiUzePKbvEJeyIHFyJb96_r1PebiFyrFHMxLZKaCho4RSSlYVhX-WrUsY1Uo_CG4Oc9DpJ9tonKjuNB_lD4GpUdhu6dUA7J5tCLtWSpsvcVRxI1eWFh066Ecj1yruRI' },
    { id: '001988', name: 'James Wilson', email: 'j.wilson@corp.com', role: 'UX Designer', status: 'Inactive', lastLogin: 'Oct 12, 2023', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfj_cAg5uCTG4BVUsZTj5eFQztEiOE60oWi2Uagnjo1SgoZy1VcZGg8Y07BEDUH4CgmsF1CFpQzDEe7u8aKjVNGlTtauDHoYcMQ5aXBx-Di8A7OR6dgOY0r3mPlhB8r7scpFzDqZesKggXZdTs8EM-uxG5JkL4tnZ6bq-ONX1K4RcF449M_qGF6vPFKqZVilUuV8gEwbfjY9M3weUTRtlAb1vniwq2mveRPcZg0JM62Tdtl3jqxn2fFI8Qu9zrucMC8W7bbcVQB1E' }
  ];

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>AdminConsole</h1>
          <p>Enterprise Edition</p>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item" href="#dash"><span className="material-symbols-outlined">dashboard</span>Dashboard</a>
          <a className="admin-nav-item active" href="#users"><span className="material-symbols-outlined">group</span>User Management</a>
          <a className="admin-nav-item" href="#roles"><span className="material-symbols-outlined">security</span>Role Permissions</a>
          <a className="admin-nav-item" href="#logs"><span className="material-symbols-outlined">history</span>Audit Logs</a>
        </nav>
      </aside>

      <main className="admin-main-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '600' }}>User Management</h2>
            <p style={{ color: 'var(--on-surface-variant)', fontSize: '14px' }}>Manage organization access and define user roles.</p>
          </div>
          <button className="filled-btn" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined">add</span> Add User
          </button>
        </div>

        {/* Bento Board Stats */}
        <div className="bento-stats-container">
          <div className="stat-bento-card soft-elevation">
            <div className="stat-card-header"><span>Total Users</span><span className="material-symbols-outlined">groups</span></div>
            <div className="stat-value">1,284</div>
          </div>
          <div className="stat-bento-card soft-elevation">
            <div className="stat-card-header"><span>Active Now</span><span className="material-symbols-outlined" style={{ color: 'var(--success-green)' }}>radio_button_checked</span></div>
            <div className="stat-value">432</div>
          </div>
        </div>

        {/* Table Records Grid Layout */}
        <div className="enterprise-data-table-wrapper soft-elevation">
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {usersMock.map((user) => (
                <tr key={user.id} onClick={() => handleRowClick(user)}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <img src={user.avatar} alt={user.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <div>
                        <div style={{ fontWeight: '600' }}>{user.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--on-surface-variant)' }}>ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ color: 'var(--on-surface-variant)' }}>{user.email}</td>
                  <td><span className="status-pill" style={{ backgroundColor: 'var(--surface-container-high)', color: 'var(--primary)' }}>{user.role}</span></td>
                  <td><span className={`status-pill ${user.status.toLowerCase()}`}>{user.status}</span></td>
                  <td style={{ color: 'var(--on-surface-variant)' }}>{user.lastLogin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <UserDrawer 
          selectedUser={selectedUser} 
          isOpen={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />
      </main>
    </div>
  );
}