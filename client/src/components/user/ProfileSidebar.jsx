import React from "react";
import { User, Package, MapPin, Heart, LogOut } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
  counts = {},
}) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    {
      key: "profile",
      label: "Personal Information",
      icon: User,
    },
    {
      key: "orders",
      label: "Order History",
      icon: Package,
      count: counts.orders,
    },
    {
      key: "addresses",
      label: "Saved Addresses",
      icon: MapPin,
      count: counts.addresses,
    },
    {
      key: "wishlist",
      label: "My Wishlist",
      icon: Heart,
      count: counts.wishlist,
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <aside className="profile-sidebar" aria-label="Account Navigation">
      <div className="sidebar-title">Account Menu</div>

      <nav className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.key;

          return (
            <button
              key={item.key}
              type="button"
              className={`sidebar-link ${isActive ? "active" : ""}`}
              onClick={() => setActiveTab(item.key)}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="sidebar-link-content">
                <Icon size={18} aria-hidden="true" />
                <span>{item.label}</span>
              </div>

              {typeof item.count === "number" && item.count > 0 && (
                <span className="sidebar-badge">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="sidebar-divider" />

      <button
        type="button"
        className="sidebar-logout-btn"
        onClick={handleLogout}
      >
        <LogOut size={18} aria-hidden="true" />
        <span>Sign Out</span>
      </button>
    </aside>
  );
}