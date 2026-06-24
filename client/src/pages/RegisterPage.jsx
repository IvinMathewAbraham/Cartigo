import React, { useState } from "react";
import "./RegisterPage.css";
import { registerUser } from "../api/auth.js";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            setLoading(true);
            const response = await registerUser({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
            });

            setSuccess(response.message || "Account created successfully!");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page-container">
            <main className="auth-card-panel">
                <div className="auth-form-container">
                    
                    <div className="brand-header">
                        <span className="material-symbols-outlined brand-icon">ac_unit</span>
                        <span className="nav-brand">Cartigo</span>
                    </div>

                    <div className="welcome-header">
                        <h1>Create Account</h1>
                        <p>Enter your information to get started.</p>
                    </div>

                    {error && <div className="auth-error-msg">{error}</div>}
                    {success && <div className="auth-success-msg">{success}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="name-row">
                            {/* First Name */}
                            <div className="input-field-group">
                                <label htmlFor="firstName">First Name</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined field-icon">person</span>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="John"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Last Name */}
                            <div className="input-field-group">
                                <label htmlFor="lastName">Last Name</label>
                                <div className="input-with-icon">
                                    <span className="material-symbols-outlined field-icon">badge</span>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="Doe"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="input-field-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">mail</span>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="input-field-group">
                            <label htmlFor="phone">Phone</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">call</span>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="input-field-group">
                            <label htmlFor="password">Password</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">lock</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div className="input-field-group">
                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <div className="input-with-icon">
                                <span className="material-symbols-outlined field-icon">lock</span>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="password-toggle-btn"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <span className="material-symbols-outlined">
                                        {showConfirmPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="primary-action-btn btn-active-scale"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    <p className="signup-redirect">
                        Already have an account?{" "}
                        <Link to="/login" className="signup-link">Sign In</Link>
                    </p>
                </div>
            </main>
        </div>
    );
}