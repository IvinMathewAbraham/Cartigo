import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import ProfileSidebar from "../components/user/ProfileSidebar";
import PersonalInfoCard from "../components/user/PersonalInfoCard";
import OrdersTable from "../components/user/OrdersTable";
import AddressCard from "../components/user/AddressCard";
import WishlistSection from "../components/user/WishlistSection";
import Header from "../components/layout/Header/Header";

import "./ProfilePage.css";

export default function ProfilePage() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "profile");

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

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
    <div>
      <Header />

      <div className="profile-page">
        <ProfileSidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="profile-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}