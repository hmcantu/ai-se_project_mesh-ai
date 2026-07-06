import React from "react";
import { NavLink } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import logoImg from "../../assets/logo.png";

// Helper function to dynamically swap styling based on the active route
function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "auth-tab-link auth-tab-link--active"
    : "auth-tab-link auth-tab-link--inactive";
}

export default function Login() {
  const { values, handleChange, errors, isValid } = useFormWithValidation({
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Form Submitted successfully! Current values:", values);
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

        {/* Updated NavLink structure utilizing the active checker */}
        <div className="auth-tabs">
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email
            </label>
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
            <label className="form-label" htmlFor="password">
              Password
            </label>
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