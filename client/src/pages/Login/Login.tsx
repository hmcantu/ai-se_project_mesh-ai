import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { useAuth } from "../../contexts/AuthContext";
import { loginUser } from "../../utils/api";
import logoImg from "../../assets/logo.png";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "auth-tab-link auth-tab-link--active"
    : "auth-tab-link auth-tab-link--inactive";
}

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [submitError, setSubmitError] = useState<string>("");

  const { values, handleChange, errors, isValid } = useFormWithValidation({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");

    try {
      const res = await loginUser(values.email, values.password);
      
      // Check both the data object and the success boolean flag from the backend layout
      if (res.success && res.data) {
        login(res.data.token, res.data.user);
        navigate("/knowledge");
      } else {
        // Fallback to the specific backend error payload message if available
        setSubmitError(res.error?.message || "Invalid credentials. Please try again.");
      }
    } catch (err: unknown) {
      const errorObj = err as Error;
      setSubmitError(errorObj.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <img className="auth-header__logo" alt="MeshAI logo" src={logoImg} />
      </header>

      <div className="auth-card">
        <div className="auth-heading-container">
          <h2 className="auth-title">Sign in</h2>
          <p className="auth-subtitle">Access your organisation's secure workspace</p>
        </div>

        <div className="auth-tabs">
          <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
          <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Status area for display server errors */}
          {submitError && (
            <div style={{ width: "380px", color: "#ef4444", marginBottom: "16px", fontFamily: "Work Sans", fontSize: "14px" }}>
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`form-input ${errors.email ? "form-input--error" : ""}`}
              required
              value={values.email || ""}
              onChange={handleChange}
              placeholder="johndoe12345@gmail.com"
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={`form-input ${errors.password ? "form-input--error" : ""}`}
              required
              minLength={8}
              value={values.password || ""}
              onChange={handleChange}
              placeholder="12345678"
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <div className="form-submit-container">
            <button type="submit" className="form-submit" disabled={!isValid}>
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}