import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useFormWithValidation } from "../../hooks/useFormWithValidation";
import { registerUser } from "../../utils/api";
import logoImg from "../../assets/logo.png";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "auth-tab-link auth-tab-link--active"
    : "auth-tab-link auth-tab-link--inactive";
}

export default function Register() {
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string>("");
  
  const { values, handleChange, errors, isValid } = useFormWithValidation({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("=== SUBMIT TRIGGERED ===");
    console.log("Current Form values state:", values);
    console.log("Is Form Valid check:", isValid);
    
    setSubmitError("");
    
    try {
      const res = await registerUser(values.name, values.email, values.password);
      console.log("Server Response payload arrived:", res);
      
      if (res.success) {
        console.log("Registration successful! Redirecting...");
        navigate("/login");
      } else {
        setSubmitError(res.error?.message || "Registration failed.");
      }
    } catch (err: any) {
      console.error("Catch handler caught an error:", err);
      setSubmitError(err.message || "An error occurred during registration.");
    }
  };

  return (
    <div className="auth-container">
      <header className="auth-header">
        <img className="auth-header__logo" alt="MeshAI logo" src={logoImg} />
      </header>

      <div className="auth-card">
        <div className="auth-heading-container">
          <h2 className="auth-title">Create account</h2>
          <p className="auth-subtitle">Access your organisation's secure workspace</p>
        </div>

        <div className="auth-tabs">
          <NavLink to="/login" className={getNavLinkClass}>Login</NavLink>
          <NavLink to="/register" className={getNavLinkClass}>Register</NavLink>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          {submitError && (
            <div style={{ width: "380px", color: "#ef4444", marginBottom: "16px", fontFamily: "Work Sans", fontSize: "14px" }}>
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={`form-input ${errors.name ? "form-input--error" : ""}`}
              required
              minLength={2}
              maxLength={40}
              value={values.name || ""}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

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
            {/* Temporarily removed disabled={!isValid} to ensure it fires logs */}
            <button type="submit" className="form-submit" style={{ width: "164px" }}>
              Create account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}