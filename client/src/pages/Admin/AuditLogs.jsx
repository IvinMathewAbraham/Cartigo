import React, { useState } from 'react';

export default function AuditLogs() {
  const [activeLogDiff, setActiveLogDiff] = useState(null);

  const logsMock = [
    { id: 'log-001', timestamp: '2026-11-24 09:42:15', user: 'Sarah Jenkins', action: 'Updated Role Permissions', resource: 'Manager Role', ip: '192.168.1.142', severity: 'success' },
    { id: 'log-002', timestamp: '2026-11-24 09:38:04', user: 'Marcus Reed', action: 'Database Config Export', resource: 'Prod-Cluster-01', ip: '45.22.109.12', severity: 'warning' },
    { id: 'log-003', timestamp: '2026-11-24 09:35:12', user: 'auth-service-v2', action: 'Unauthorized Login Attempt', resource: 'Global Auth Gate', ip: '82.11.4.156', severity: 'critical' }
  ];

  return (
    <div className="admin-layout-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <h1>AdminConsole</h1>
          <p>Security Audit</p>
        </div>
        <nav className="admin-nav">
          <a className="admin-nav-item" href="#users"><span className="material-symbols-outlined">group</span>Users</a>
          <a className="admin-nav-item active" href="#audit"><span className="material-symbols-outlined">history</span>System Audit Logs</a>
        </nav>
      </aside>

      <main className="admin-main-view">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--primary)' }}>System Audit Trails</h1>
            <p style={{ color: 'var(--on-surface-variant)' }}>Comprehensive compliance event history tracking registry.</p>
          </div>
        </div>

        <div className="enterprise-data-table-wrapper soft-elevation" style={{ marginBottom: '32px' }}>
          <table className="enterprise-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Identity Actor</th>
                <th>Action Scope</th>
                <th>Target Resource</th>
                <th>Origin Address</th>
                <th>Event Severity</th>
              </tr>
            </thead>
            <tbody>
              {logsMock.map((log) => (
                <tr key={log.id} onClick={() => setActiveLogDiff(log.id)}>
                  <td>
                    <div style={{ fontWeight: '500' }}>{log.timestamp}</div>
                    <div style={{ fontSize: '11px', color: 'var(--outline)' }}>UTC-05:00</div>
                  </td>
                  <td style={{ fontWeight: '600' }}>{log.user}</td>
                  <td>{log.action}</td>
                  <td>{log.resource}</td>
                  <td><code style={{ padding: '2px 6px', backgroundColor: 'var(--surface-container-low)', borderRadius: '4px' }}>{log.ip}</code></td>
                  <td>
                    <span className={`audit-severity-pill ${log.severity}`}>
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Code Diff Display Node Panel */}
        {activeLogDiff && (
          <div className="inventory-card-section soft-elevation">
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Payload Mutation Diff Breakdown ({activeLogDiff})</h3>
            <div className="code-payload-diff-container">
              <span className="diff-line-item">{"{"}</span>
              <span className="diff-line-item">{"  \"resource_id\": \"role_829103\","}</span>
              <span className="diff-line-item removed">{"-   \"allow_delete\": false,"}</span>
              <span className="diff-line-item added">{"+   \"allow_delete\": true,"}</span>
              <span className="diff-line-item added">{"+   \"session_timeout\": \"2h\","}</span>
              <span className="diff-line-item">{"}"}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}