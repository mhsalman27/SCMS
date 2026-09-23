import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser, registerAdmin } from "../../Services/AuthServices";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import toast from "react-hot-toast";
import "./AuthStyles.css";

const Register = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    secretKey: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isAdmin) await registerAdmin(form);
      else await registerUser(form);
      toast.success("Account created! Please login.");
      navigate("/login");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: "username",
      type: "text",
      icon: "fa-user",
      placeholder: "Full name",
      autoComplete: "name",
    },
    {
      name: "email",
      type: "email",
      icon: "fa-envelope",
      placeholder: "Email address",
      autoComplete: "email",
    },
    {
      name: "password",
      type: "password",
      icon: "fa-lock",
      placeholder: "Password (min 6 chars)",
      autoComplete: "new-password",
    },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card-premium">
        <div className="auth-brand">
          <div
            className="auth-brand-icon"
            style={{
              background: isAdmin
                ? "linear-gradient(135deg,#DD0200,#55100D)"
                : "linear-gradient(135deg,#DD0200,#DD0200)",
            }}
          >
            <i
              className={`fa-solid ${isAdmin ? "fa-user-shield" : "fa-user-plus"}`}
            ></i>
          </div>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join SCMS to manage complaints</p>
        </div>

        {/* Role toggle */}
        <div className="role-toggle">
          <button
            type="button"
            className={`role-toggle-btn ${!isAdmin ? "active" : ""}`}
            onClick={() => setIsAdmin(false)}
          >
            <i className="fa-solid fa-user me-2"></i>User
          </button>
          <button
            type="button"
            className={`role-toggle-btn ${isAdmin ? "active-admin" : ""}`}
            onClick={() => setIsAdmin(true)}
          >
            <i className="fa-solid fa-user-shield me-2"></i>Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {fields.map((f) => (
            <div key={f.name} className="auth-field">
              <label className="auth-label">
                {f.name.charAt(0).toUpperCase() + f.name.slice(1)}
              </label>
              <div className="auth-input-box">
                <span className="auth-icon">
                  <i className={`fa-solid ${f.icon}`}></i>
                </span>
                <input
                  type={f.type}
                  name={f.name}
                  className="auth-input"
                  placeholder={f.placeholder}
                  value={form[f.name]}
                  onChange={handleChange}
                  required
                  autoComplete={f.autoComplete}
                />
              </div>
            </div>
          ))}

          {/* Admin secret key */}
          {isAdmin && (
            <div className="auth-field">
              <label className="auth-label">Admin Secret Key</label>
              <div className="auth-input-box">
                <span className="auth-icon" style={{ color: "#DD0200" }}>
                  <i className="fa-solid fa-key"></i>
                </span>
                <input
                  type="password"
                  name="secretKey"
                  className="auth-input"
                  placeholder="Enter admin secret key"
                  value={form.secretKey}
                  onChange={handleChange}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn-premium auth-submit"
            style={{
              background: isAdmin
                ? "linear-gradient(135deg,#DD0200,#55100D)"
                : undefined,
            }}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Creating...
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket me-2"></i>Create Account
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-link">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
