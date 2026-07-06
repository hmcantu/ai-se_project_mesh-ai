import React from "react";
import { NavLink } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
// Import your local bundled logo image directly!
import logoImg from "../../assets/logo.png";

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
      {/* Absolute Header Ribbon using your imported local image handle */}
      <header className="auth-header">
        <img className="auth-header__logo" alt="MeshAI logo" src={logoImg} />
      </header>

      {/* Main Container Card Wrapper */}
      <div className="auth-card">
        <div className="auth-heading-container">
          <h2 className="auth-title">Sign in</h2>
          <p className="auth-subtitle">Access your organisation's secure workspace</p>
        </div>

        {/* Side-By-Side Button Nav Switcher Tabs */}
        <div className="auth-tabs">
          <NavLink to="/login" className="auth-tab-link auth-tab-link--active">
            Login
          </NavLink>
          <NavLink to="/register" className="auth-tab-link auth-tab-link--inactive">
            Register
          </NavLink>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {/* Email Block */}
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
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          {/* Password Block */}
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
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {/* Submit Button Block */}
          <div className="form-submit-container">
            <button
              type="submit"
              className="form-submit"
              disabled={!isValid}
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}