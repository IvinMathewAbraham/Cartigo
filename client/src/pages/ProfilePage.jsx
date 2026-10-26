import { useState, useEffect } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/api";

import ProfileSidebar from "../components/user/ProfileSidebar";
import PersonalInfoCard from "../components/user/PersonalInfoCard";
import OrdersTable from "../components/user/OrdersTable";
import AddressCard from "../components/user/AddressCard";
import WishlistSection from "../components/user/WishlistSection";
import Header from "../components/layout/Header/Header";

import "./ProfilePage.css";

export default function ProfilePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");
  const [counts, setCounts] = useState({
    orders: 0,
    wishlist: 0,
    addresses: 0,
  });

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  // Load account metrics for banner & badges
  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [ordersRes, wishlistRes, addressesRes] = await Promise.allSettled([
          api.get("/orders"),
          api.get("/wishlist"),
          api.get("/addresses"),
        ]);

        const orderList = ordersRes.status === "fulfilled" 
          ? (ordersRes.value.data?.data || ordersRes.value.data || []) 
          : [];
        const wishlistList = wishlistRes.status === "fulfilled"
          ? (wishlistRes.value.data?.data?.wishlist_item || [])
          : [];
        const addressList = addressesRes.status === "fulfilled"
          ? (addressesRes.value.data || [])
          : [];

        setCounts({
          orders: Array.isArray(orderList) ? orderList.length : 0,
          wishlist: Array.isArray(wishlistList) ? wishlistList.length : 0,
          addresses: Array.isArray(addressList) ? addressList.length : 0,
        });
      } catch (err) {
        console.error("Failed to load profile metrics", err);
      }
    };

    fetchMetrics();
  }, [activeTab]);

  const getTabTitle = () => {
    switch (activeTab) {
      case "orders":
        return "Order History";
      case "addresses":
        return "Saved Addresses";
      case "wishlist":
        return "My Wishlist";
      default:
        return "Personal Information";
    }
  };

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstName ? user.firstName[0].toUpperCase() : "";
    const last = user.lastName ? user.lastName[0].toUpperCase() : "";
    return `${first}${last}` || (user.email ? user.email[0].toUpperCase() : "U");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return <OrdersTable />;
      case "addresses":
        return <AddressCard />;
      case "wishlist":
        return <WishlistSection />;
      default:
        return <PersonalInfoCard />;
    }
  };

  return (
    <div className="profile-page-wrapper">
      <Header />

      {/* Breadcrumbs */}
      <div className="profile-breadcrumbs-bar">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/profile" onClick={() => setActiveTab("profile")}>My Account</Link>
        <span>/</span>
        <span className="active-crumb">{getTabTitle()}</span>
      </div>

      {/* Modern Profile Header Banner */}
      <div className="profile-header-banner">
        <div className="profile-banner-card">
          <div className="profile-user-summary">
            <div className="profile-avatar-circle" aria-hidden="true">
              {getUserInitials()}
            </div>
            <div className="profile-user-details">
              <h1>
                {user ? `${user.firstName || "Valued"} ${user.lastName || "Member"}` : "Welcome to Cartigo"}
              </h1>
              <div className="profile-user-meta">
                <span>{user?.email || "Shopper"}</span>
                <span className="profile-badge-pill">Verified Account</span>
              </div>
            </div>
          </div>

          <div className="profile-banner-stats">
            <div className="profile-stat-item">
              <div className="profile-stat-number">{counts.orders}</div>
              <div className="profile-stat-label">Total Orders</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-number">{counts.wishlist}</div>
              <div className="profile-stat-label">Saved Items</div>
            </div>
            <div className="profile-stat-item">
              <div className="profile-stat-number">{counts.addresses}</div>
              <div className="profile-stat-label">Addresses</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Container */}
      <div className="profile-page-container">
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          counts={counts}
        />

        <main className="profile-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}