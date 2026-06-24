import { User, Package, MapPin, Heart } from "lucide-react";
import '../../pages/ProfilePage.css';

export default function ProfileSidebar({
  activeTab,
  setActiveTab,
}) {
  const menuItems = [
    {
      key: "profile",
      label: "Personal Information",
      icon: User,
    },
    {
      key: "orders",
      label: "Orders",
      icon: Package,
    },
    {
      key: "addresses",
      label: "Addresses",
      icon: MapPin,
    },
    {
      key: "wishlist",
      label: "Wishlist",
      icon: Heart,
    },
  ];

  return (
    <aside className="profile-sidebar">
      <h2>My Account</h2>

      <div className="sidebar-menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.key}
              className={`sidebar-link ${
                activeTab === item.key
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setActiveTab(item.key)
              }
            >
              <Icon size={18} />

              <span>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}