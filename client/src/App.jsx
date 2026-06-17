import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home/Home';
import Shop from './pages/Shop/Shop';
import LoginCard from './features/auth/LoginCard';
import AdminUserManagement from './features/admin/AdminUserManagement';
import AddProductInventory from './features/admin/AddProductInventory';
import SupportTickets from './pages/Admin/SupportTickets';
import RolePermissions from './pages/Admin/RolePermissions';
import AuditLogs from './pages/Admin/AuditLogs';
import './App.css';

export default function App() {



  return (
    <BrowserRouter>
      <Routes>
        {/* Marketplace E-Commerce Portal Interface */}
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/login" element={<LoginCard />} />

        {/* Administration Console Core Ecosystem Matrix */}
        <Route path="/admin/users" element={<AdminUserManagement />} />
        <Route path="/admin/inventory/new" element={<AddProductInventory />} />
        <Route path="/admin/support" element={<SupportTickets />} />
        <Route path="/admin/roles" element={<RolePermissions />} />
        <Route path="/admin/audit" element={<AuditLogs />} />

        {/* Catch-All Fallback Redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}