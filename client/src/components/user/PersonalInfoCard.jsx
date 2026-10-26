import { useEffect, useState } from "react";
import api from "../../api/api";
import { updateProfile } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { User, Mail, Phone, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";

export default function PersonalInfoCard() {
  const { setUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      const user = response.data?.user || response.data;

      if (user) {
        setFormData({
          firstName: user.firstName || "",
          lastName: user.lastName || "",
          email: user.email || "",
          phone: user.phone || "",
        });
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setFeedback(null);
    try {
      setSaving(true);
      const response = await updateProfile(formData);
      const updatedUser = response.data?.user || response.data;
      if (updatedUser) {
        setUser(updatedUser);
      }
      setFeedback({
        type: "success",
        message: "Your profile information has been successfully updated.",
      });

      // Clear success feedback after 4 seconds
      setTimeout(() => {
        setFeedback(null);
      }, 4000);
    } catch (error) {
      console.error("Update profile error:", error);
      setFeedback({
        type: "error",
        message: error.response?.data?.message || "Failed to update profile. Please try again.",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-card">
        <div style={{ textAlign: "center", padding: "48px 0", color: "var(--color-text-muted)" }}>
          Loading profile details...
        </div>
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-card-title-group">
          <h2>Personal Information</h2>
          <p>Update your personal details and contact preferences</p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="btn-primary-navy"
          disabled={saving}
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>

      {feedback && (
        <div className={`profile-feedback-banner ${feedback.type}`} role="alert">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {feedback.type === "success" ? (
              <CheckCircle2 size={18} />
            ) : (
              <AlertCircle size={18} />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: "none", border: "none", cursor: "pointer", color: "inherit", fontWeight: 600 }}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="profile-form-grid">
          <div className="profile-field-group">
            <label htmlFor="firstName">First Name</label>
            <div className="profile-input-wrapper">
              <input
                id="firstName"
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                className="profile-input"
                required
              />
            </div>
          </div>

          <div className="profile-field-group">
            <label htmlFor="lastName">Last Name</label>
            <div className="profile-input-wrapper">
              <input
                id="lastName"
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                className="profile-input"
              />
            </div>
          </div>

          <div className="profile-field-group">
            <label htmlFor="email">Email Address</label>
            <div className="profile-input-wrapper">
              <input
                id="email"
                type="email"
                value={formData.email}
                disabled
                className="profile-input"
                title="Email cannot be changed directly for security reasons"
              />
              <span className="profile-verified-badge">
                <ShieldCheck size={12} style={{ display: "inline", marginRight: "3px", verticalAlign: "middle" }} />
                Verified
              </span>
            </div>
          </div>

          <div className="profile-field-group">
            <label htmlFor="phone">Phone Number</label>
            <div className="profile-input-wrapper">
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="profile-input"
              />
            </div>
          </div>
        </div>

        {/* Security Overview */}
        <div className="profile-security-box">
          <h4>
            <ShieldCheck size={18} color="var(--color-brand-primary)" />
            Account Security & Standards
          </h4>
          <div className="profile-security-items">
            <div className="profile-security-item">
              <span>Authentication</span>
              <strong>JWT Cookie (HttpOnly)</strong>
            </div>
            <div className="profile-security-item">
              <span>Password Status</span>
              <strong>Encrypted & Active</strong>
            </div>
            <div className="profile-security-item">
              <span>Account Status</span>
              <strong style={{ color: "var(--color-success-text)" }}>Active Customer</strong>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}