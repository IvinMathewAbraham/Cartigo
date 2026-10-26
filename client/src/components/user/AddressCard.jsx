import { useEffect, useState } from "react";
import { 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress 
} from "../../api/address";
import { 
  MapPin, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  Home, 
  Briefcase, 
  Building 
} from "lucide-react";

export default function AddressCard() {
  const emptyAddress = {
    label: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
    isDefault: false,
  };

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyAddress);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const response = await getAddresses();
      setAddresses(response.data || response || []);
    } catch (error) {
      console.error("Failed to load addresses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e?.preventDefault();
    if (!formData.addressLine1 || !formData.city || !formData.postalCode) {
      setFeedback({ type: "error", message: "Please fill in Address Line 1, City, and Postal Code." });
      return;
    }

    try {
      setSubmitting(true);
      await createAddress(formData);
      setShowForm(false);
      setFormData(emptyAddress);
      setFeedback({ type: "success", message: "New address added successfully!" });
      await loadAddresses();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Failed to create address. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label || "Home",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      postalCode: address.postalCode || "",
      country: address.country || "India",
      isDefault: Boolean(address.isDefault),
    });
    setShowForm(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const handleUpdate = async (e) => {
    e?.preventDefault();
    try {
      setSubmitting(true);
      await updateAddress(editingId, formData);
      setShowForm(false);
      setEditingId(null);
      setFormData(emptyAddress);
      setFeedback({ type: "success", message: "Address updated successfully!" });
      await loadAddresses();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Failed to update address. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSetDefault = async (address) => {
    try {
      await updateAddress(address.id, {
        ...address,
        isDefault: true,
      });
      setFeedback({ type: "success", message: `Address "${address.label}" set as default.` });
      await loadAddresses();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this address?")) return;
    try {
      await deleteAddress(id);
      setFeedback({ type: "success", message: "Address deleted successfully." });
      await loadAddresses();
    } catch (error) {
      console.error(error);
      setFeedback({ type: "error", message: "Failed to delete address." });
    }
  };

  const getLabelIcon = (label) => {
    const l = (label || "").toLowerCase();
    if (l.includes("work") || l.includes("office")) return <Briefcase size={14} />;
    if (l.includes("building") || l.includes("other")) return <Building size={14} />;
    return <Home size={14} />;
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
          Loading saved addresses...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <h2>Saved Addresses</h2>
          <p>Manage your delivery destinations for rapid checkout</p>
        </div>

        {!showForm && (
          <button
            type="button"
            className="btn-primary-navy"
            onClick={() => {
              setEditingId(null);
              setFormData(emptyAddress);
              setShowForm(true);
            }}
          >
            <Plus size={16} />
            Add New Address
          </button>
        )}
      </div>

      {feedback && (
        <div className={`profile-feedback-banner ${feedback.type}`} role="alert">
          <span>{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Add / Edit Form Box */}
      {showForm && (
        <div className="address-form-box">
          <h4>{editingId ? "Edit Address Details" : "Add New Delivery Address"}</h4>

          <form onSubmit={editingId ? handleUpdate : handleCreate}>
            <div className="address-form-grid">
              <div className="profile-field-group">
                <label>Address Label</label>
                <select
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="profile-input"
                  style={{ cursor: "pointer" }}
                >
                  <option value="Home">Home</option>
                  <option value="Office">Office</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="profile-field-group">
                <label>Country / Region</label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group full-width">
                <label>Address Line 1 (Street Address, House/Flat No.)</label>
                <input
                  type="text"
                  placeholder="e.g. 102, Ocean Breeze Apartments, Linking Road"
                  value={formData.addressLine1}
                  onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group full-width">
                <label>Address Line 2 (Apartment, Suite, Landmark - Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Near City Center Mall"
                  value={formData.addressLine2}
                  onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                  className="profile-input"
                />
              </div>

              <div className="profile-field-group">
                <label>City / Town</label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group">
                <label>State / Province</label>
                <input
                  type="text"
                  placeholder="e.g. Maharashtra"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group">
                <label>Postal / PIN Code</label>
                <input
                  type="text"
                  placeholder="e.g. 400050"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  className="profile-input"
                  required
                />
              </div>

              <div className="profile-field-group" style={{ justifyContent: "center" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", marginTop: "24px" }}>
                  <input
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    style={{ width: "16px", height: "16px", accentColor: "var(--color-brand-primary)" }}
                  />
                  <span>Make this my default shipping address</span>
                </label>
              </div>
            </div>

            <div className="address-form-actions">
              <button
                type="button"
                className="btn-outline-subtle"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn-primary-navy"
                disabled={submitting}
              >
                {submitting ? "Saving..." : editingId ? "Update Address" : "Save Address"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="profile-empty-state">
          <div className="profile-empty-icon">
            <MapPin size={32} />
          </div>
          <h3>No Saved Addresses</h3>
          <p>Save your home and office addresses to enjoy frictionless 1-click checkout.</p>
          <button
            type="button"
            className="btn-primary-navy"
            onClick={() => {
              setEditingId(null);
              setFormData(emptyAddress);
              setShowForm(true);
            }}
          >
            Add Address Now
          </button>
        </div>
      ) : (
        <div className="address-grid">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`address-card-item ${address.isDefault ? "is-default" : ""}`}
            >
              <div>
                <div className="address-card-header">
                  <span className="address-label-pill">
                    {getLabelIcon(address.label)}
                    {address.label || "Address"}
                  </span>

                  {address.isDefault && (
                    <span className="address-default-badge">
                      <Check size={12} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
                      Default
                    </span>
                  )}
                </div>

                <div className="address-card-body">
                  <p style={{ fontWeight: 600, color: "var(--color-text-primary)" }}>
                    {address.addressLine1}
                  </p>
                  {address.addressLine2 && <p>{address.addressLine2}</p>}
                  <p>
                    {address.city}, {address.state} — <strong>{address.postalCode}</strong>
                  </p>
                  <p style={{ color: "var(--color-text-muted)", fontSize: "13px" }}>
                    {address.country}
                  </p>
                </div>
              </div>

              <div className="address-card-actions">
                {!address.isDefault && (
                  <button
                    type="button"
                    className="address-action-btn"
                    onClick={() => handleSetDefault(address)}
                  >
                    Set as Default
                  </button>
                )}

                <button
                  type="button"
                  className="address-action-btn"
                  onClick={() => startEdit(address)}
                >
                  <Edit3 size={14} />
                  Edit
                </button>

                <button
                  type="button"
                  className="address-action-btn delete"
                  onClick={() => handleDelete(address.id)}
                  aria-label="Delete address"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
