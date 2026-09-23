import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../Services/AuthServices";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import toast from "react-hot-toast";
import "./AuthStyles.css";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const data = await loginUser(form);
      localStorage.setItem(
        "scms",
        JSON.stringify({
          token: data.token,
          user: {
            id: data.user.id,
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
          },
        }),
      );
      toast.success(data.message);
      if (data.user.role === "admin") navigate("/admin");
      else if (data.user.role === "employee") navigate("/employee");
      else navigate("/home");
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card-premium">
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your SCMS account</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <div className="auth-input-box">
              <span className="auth-icon">
                <i className="fa-solid fa-envelope"></i>
              </span>
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password */}
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div className="auth-input-box">
              <span className="auth-icon">
                <i className="fa-solid fa-lock"></i>
              </span>
              <input
                type={showPass ? "text" : "password"}
                name="password"
                className="auth-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                className="auth-eye"
                onClick={() => setShowPass(!showPass)}
              >
                <i
                  className={`fa-solid ${showPass ? "fa-eye-slash" : "fa-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn-premium auth-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                Signing in...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket me-2"></i>Sign
                In
              </>
            )}
          </button>
        </form>

        <p className="auth-footer-text">
          No account?{" "}
          <Link to="/register" className="auth-link">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
