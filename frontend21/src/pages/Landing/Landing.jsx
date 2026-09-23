import React from "react";
import { Link } from "react-router-dom";
import "./Landing.css";

const Landing = () => {
  const features = [
    {
      icon: "fa-file-circle-plus",
      grad: "var(--grad-primary)",
      title: "Submit",
      desc: "File a complaint with details and optional photo in under 60 seconds.",
    },
    {
      icon: "fa-user-gear",
      grad: "var(--grad-info)",
      title: "Assign",
      desc: "Admin reviews and assigns to the right employee for fast resolution.",
    },
    {
      icon: "fa-screwdriver-wrench",
      grad: "var(--grad-warning)",
      title: "Resolve",
      desc: "Employee works on it and submits visual proof of completion.",
    },
    {
      icon: "fa-timeline",
      grad: "var(--grad-forest)",
      title: "Track",
      desc: "Real-time timeline shows every status change with timestamps.",
    },
  ];

  const stats = [
    { value: "3", label: "Roles", icon: "fa-users" },
    { value: "∞", label: "Complaints Tracked", icon: "fa-infinity" },
    { value: "100%", label: "Transparent", icon: "fa-eye" },
    { value: "24/7", label: "Available", icon: "fa-clock" },
  ];

  return (
    <div className="landing-page">
      {/* HERO */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">
            <i className="fa-solid fa-sparkles me-2"></i>Premium Complaint
            Management
          </div>
          <h1 className="hero-title">
            Manage Complaints
            <br />
            <span className="glow-text">at Scale</span>
          </h1>
          <p className="hero-subtitle">
            A powerful, role-based system for submitting, assigning, tracking
            and resolving complaints — with complete transparency at every step.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn-premium shadow-none text-decoration-none  hero-cta">
              <i className="fa-solid fa-rocket"></i>Get Started Free
            </Link>
            <Link to="/login" className="btn-ghost text-decoration-none text-white hero-cta-ghost">
              <i className="fa-solid fa-arrow-right-to-bracket"></i>Sign In
            </Link>
          </div>

          {/* Stat Pills */}
          <div className="hero-stats">
            {stats.map((s) => (
              <div key={s.label} className="stat-pill">
                <i className={`fa-solid ${s.icon}`}></i>
                <span className="stat-pill-value">{s.value}</span>
                <span className="stat-pill-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Floating 3D Cards */}
        <div className="hero-cards-orbit">
          <div className="orbit-ring">
            {["Submitted", "Assigned", "On Working", "Resolved"].map(
              (stage, i) => (
                <div key={i} className="orbit-card" style={{ "--i": i }}>
                  <i
                    className={`fa-solid ${
                      i === 0
                        ? "fa-file-circle-check"
                        : i === 1
                          ? "fa-user-tie"
                          : i === 2
                            ? "fa-screwdriver-wrench"
                            : "fa-circle-check"
                    }`}
                  ></i>
                  <span>{stage}</span>
                </div>
              ),
            )}
          </div>
          <div className="orbit-center">
            <i className="fa-solid fa-shield-halved"></i>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-badge">How It Works</div>
          <h2>Four simple steps to resolution</h2>
          <p>Designed for transparency, speed, and accountability</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card-premium"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-num">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="feature-icon-wrap" style={{ background: f.grad }}>
                <i className={`fa-solid ${f.icon}`}></i>
              </div>
              <h4>{f.title}</h4>
              <p>{f.desc}</p>
              <div
                className="feature-line"
                style={{ background: f.grad }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* ROLES */}
      <section className="roles-section">
        <div className="section-header">
          <div className="section-badge">Roles</div>
          <h2>Three Roles. One System.</h2>
        </div>
        <div className="roles-grid">
          {[
            {
              role: "User",
              grad: "var(--grad-primary)",
              icon: "fa-user",
              items: [
                "Submit complaints instantly",
                "Edit while still pending",
                "Track real-time timeline",
                "View rejection reasons",
              ],
            },
            {
              role: "Admin",
              grad: "var(--grad-danger)",
              icon: "fa-user-shield",
              items: [
                "View all complaints",
                "Assign to employees",
                "Reject with mandatory reason",
                "Manage user promotions",
              ],
            },
            {
              role: "Employee",
              grad: "var(--grad-forest)",
              icon: "fa-user-tie",
              items: [
                "See assigned complaints",
                "Mark as On Working",
                "Resolve with proof image",
                "View resolved history",
              ],
            },
          ].map((r) => (
            <div key={r.role} className="role-card-premium">
              <div
                className="role-card-glow"
                style={{ background: r.grad }}
              ></div>
              <div className="role-icon-premium" style={{ background: r.grad }}>
                <i className={`fa-solid ${r.icon}`}></i>
              </div>
              <h4>{r.role}</h4>
              <ul>
                {r.items.map((item) => (
                  <li key={item}>
                    <i className="fa-solid fa-circle-check text-success me-2"></i>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/register"
                className="role-cta"
                style={{ background: r.grad }}
              >
                Join as {r.role}{" "}
                <i className="fa-solid fa-arrow-right ms-1"></i>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="cta-banner">
        <div className="cta-glow"></div>
        <h2>Ready to bring order to chaos?</h2>
        <p>Start managing complaints efficiently today.</p>
        <Link
          to="/register"
          className="btn-premium shadow-none text-decoration-none"
          style={{ fontSize: "1rem", padding: "0.75rem 2.5rem" }}
        >
          <i className="fa-solid fa-bolt me-2 "></i>Get Started — It's Free
        </Link>
      </section>

      <footer className="landing-footer-premium">
        <div className="brand-icon" style={{ margin: "0 auto 0.5rem" }}>
          <i className="fa-solid fa-shield-halved"></i>
        </div>
        <p
          className="glow-text"
          style={{ fontSize: "1.1rem", fontWeight: 800 }}
        >
          SCMS
        </p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
          Smart Complaint Management System
        </p>
      </footer>
    </div>
  );
};

export default Landing;
