import { useEffect, useState } from "react";
import api from "../../api/api";
import '../../pages/ProfilePage.css';
import { updateProfile } from "../../api/auth";

export default function PersonalInfoCard() {
  const [formData, setFormData] =
    useState({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response =
        await api.get("/auth/me");

      const user =
        response.data.user;

      setFormData({
        firstName:
          user.firstName || "",
        lastName:
          user.lastName || "",
        email: user.email || "",
        phone: user.phone || "",
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit =
  async () => {
    try {
      setSaving(true);

      const response =
        await updateProfile(
          formData
        );

      setFormData(
        response.data
      );
      

      alert(
        "Profile updated successfully"
      );
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-card">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="profile-card">
      <div className="card-header">
        <div>
          <h3>
            Personal Information
          </h3>

          <p>
            Manage your account
            details
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="save-btn"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Changes"}
        </button>
      </div>

      <div className="profile-grid">
        <div>
          <label>
            First Name
          </label>

          <input
            type="text"
            name="firstName"
            value={
              formData.firstName
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div>
          <label>
            Last Name
          </label>

          <input
            type="text"
            name="lastName"
            value={
              formData.lastName
            }
            onChange={
              handleChange
            }
          />
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            value={
              formData.email
            }
            disabled
          />
        </div>

        <div>
          <label>Phone</label>

          <input
            type="text"
            name="phone"
            value={
              formData.phone
            }
            onChange={
              handleChange
            }
          />
        </div>
      </div>
    </div>
  );
}