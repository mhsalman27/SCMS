import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from "recharts";
import { getMyComplaints } from "../../Services/ComplaintServices";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import SubmitComplaint from "../../components/SubmitComplaint";
import toast from "react-hot-toast";
import "./UserDashboard.css";

const statusConfig = {
  "Pending":     { color:"#DD0200", icon:"fa-clock",             grad:"linear-gradient(135deg,#DD0200,#55100D)" },
  "In Progress": { color:"#DD0200", icon:"fa-spinner",           grad:"linear-gradient(135deg,#DD0200,#55100D)" },
  "On Working":  { color:"#DD0200", icon:"fa-screwdriver-wrench",grad:"linear-gradient(135deg,#DD0200,#DD0200)" },
  "Resolved":    { color:"#DD0200", icon:"fa-circle-check",      grad:"linear-gradient(135deg,#DD0200,#55100D)" },
  "Rejected":    { color:"#DD0200", icon:"fa-circle-xmark",      grad:"linear-gradient(135deg,#DD0200,#55100D)" },
};

const UserDashboard = () => {
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("scms"))?.user;
  const [complaints,     setComplaints]     = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showSubmit,     setShowSubmit]     = useState(false);
  const [carouselIndex,  setCarouselIndex]  = useState(0);

  useEffect(() => { fetchComplaints(); }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const data = await getMyComplaints();
      setComplaints(data.complaints);
    } catch(e) { toast.error(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  const stats = {
    total:      complaints.length,
    pending:    complaints.filter(c=>c.status==="Pending").length,
    inProgress: complaints.filter(c=>c.status==="In Progress").length,
    onWorking:  complaints.filter(c=>c.status==="On Working").length,
    resolved:   complaints.filter(c=>c.status==="Resolved").length,
    rejected:   complaints.filter(c=>c.status==="Rejected").length,
  };

  const radialData = [
    { name:"Resolved", value: stats.total>0?Math.round(stats.resolved/stats.total*100):0, fill:"#DD0200" },
    { name:"Active",   value: stats.total>0?Math.round((stats.pending+stats.inProgress+stats.onWorking)/stats.total*100):0, fill:"#DD0200" },
    { name:"Rejected", value: stats.total>0?Math.round(stats.rejected/stats.total*100):0, fill:"#DD0200" },
  ];

  const recent = complaints.slice(0, 6);
  const prev = () => setCarouselIndex(i => Math.max(0, i-1));
  const next = () => setCarouselIndex(i => Math.min(recent.length-1, i+1));

  const getBadgeClass = (status) => {
    const m = { "Pending":"badge-pending","In Progress":"badge-progress","On Working":"badge-onworking","Resolved":"badge-resolved","Rejected":"badge-rejected" };
    return m[status] || "badge-pending";
  };

  return (
    <div className="user-db-page">

      <div className="user-db-container">
        {/* HEADER */}
        <div className="user-db-header animate-fade-up">
          <div>
            <h2 style={{ fontWeight:900, marginBottom:4 }}>
              My <span className="glow-text">Dashboard</span>
            </h2>
            <p style={{ color:"var(--text-muted)", margin:0, fontSize:"0.9rem" }}>
              Hello, <strong style={{ color:"#DD0200" }}>{user?.username}</strong> 👋 Here's your complaint overview
            </p>
          </div>
          <button className="btn-premium" onClick={() => setShowSubmit(true)}>
            <i className="fa-solid fa-plus"></i>New Complaint
          </button>
        </div>

        {/* MAIN GRID */}
        <div className="user-main-grid">
          {/* LEFT: Stats */}
          <div className="user-stats-col">
            {/* Big total card */}
            <div className="total-card">
              <div className="total-card-bg"></div>
              <div style={{ position:"relative", zIndex:1 }}>
                <p style={{ color:"rgba(221, 2, 0,0.7)", fontSize:"0.85rem", margin:"0 0 4px" }}>Total Complaints</p>
                <h1 style={{ fontSize:"3.5rem", fontWeight:900, margin:0, color:"#D9D9D9", lineHeight:1 }}>
                  {loading ? "—" : stats.total}
                </h1>
                <p style={{ color:"rgba(221, 2, 0,0.5)", fontSize:"0.8rem", margin:"8px 0 0" }}>
                  {stats.resolved} resolved · {stats.rejected} rejected
                </p>
              </div>
              <button
                className="total-card-btn"
                onClick={() => navigate("/my-complaints")}
              >
                View All <i className="fa-solid fa-arrow-right ms-1"></i>
              </button>
            </div>

            {/* Mini stat grid */}
            <div className="mini-stats-grid">
              {[
                { label:"Pending",     val:stats.pending,    color:"#DD0200", icon:"fa-clock" },
                { label:"In Progress", val:stats.inProgress, color:"#DD0200", icon:"fa-spinner" },
                { label:"On Working",  val:stats.onWorking,  color:"#DD0200", icon:"fa-screwdriver-wrench" },
                { label:"Rejected",    val:stats.rejected,   color:"#DD0200", icon:"fa-circle-xmark" },
              ].map(s => (
                <div key={s.label} className="mini-stat-card">
                  <i className={`fa-solid ${s.icon}`} style={{ color:s.color, fontSize:"1.1rem" }}></i>
                  <span style={{ fontSize:"1.4rem", fontWeight:800, color:"var(--text-primary)" }}>{loading?"—":s.val}</span>
                  <span style={{ fontSize:"0.72rem", color:"var(--text-muted)", fontWeight:500 }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Radial Chart */}
            {!loading && stats.total > 0 && (
              <div className="radial-chart-card">
                <h6 style={{ fontWeight:700, marginBottom:"0.5rem", fontSize:"0.9rem" }}>Resolution Rate</h6>
                <ResponsiveContainer width="100%" height={180}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius={35} outerRadius={80} data={radialData}>
                    <PolarAngleAxis type="number" domain={[0,100]} tick={false}/>
                    <RadialBar dataKey="value" cornerRadius={6} background={{ fill:"rgba(221, 2, 0,0.04)" }}/>
                    <text x="50%" y="48%" textAnchor="middle" fill="#DD0200" fontSize={22} fontWeight={800} fontFamily="Space Grotesk">{radialData[0].value}%</text>
                    <text x="50%" y="60%" textAnchor="middle" fill="#D9D9D9" fontSize={11}>Resolved</text>
                  </RadialBarChart>
                </ResponsiveContainer>
                <div style={{ display:"flex", justifyContent:"center", gap:"1rem", flexWrap:"wrap" }}>
                  {radialData.map(d => (
                    <span key={d.name} style={{ display:"flex", alignItems:"center", gap:5, fontSize:"0.75rem", color:"var(--text-secondary)" }}>
                      <span style={{ width:8, height:8, borderRadius:"50%", background:d.fill, display:"inline-block" }}></span>
                      {d.name} {d.value}%
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Carousel of recent complaints */}
          <div className="user-carousel-col">
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
              <h5 style={{ fontWeight:700, margin:0 }}>Recent Complaints</h5>
              <div style={{ display:"flex", gap:"0.5rem" }}>
                <button className="carousel-btn" onClick={prev} disabled={carouselIndex===0}>
                  <i className="fa-solid fa-chevron-left"></i>
                </button>
                <button className="carousel-btn" onClick={next} disabled={carouselIndex>=recent.length-1}>
                  <i className="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>

            {loading ? (
              <div style={{ display:"flex", gap:"1rem" }}>
                {[0,1].map(i => <div key={i} className="skeleton" style={{ height:280, flex:1, borderRadius:16 }}/>)}
              </div>
            ) : recent.length === 0 ? (
              <div className="empty-state-premium">
                <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>📋</div>
                <h5>No complaints yet</h5>
                <p style={{ color:"var(--text-muted)" }}>Submit your first complaint to get started</p>
                <button className="btn-premium" onClick={() => setShowSubmit(true)}>
                  <i className="fa-solid fa-plus"></i>Submit Complaint
                </button>
              </div>
            ) : (
              <div className="carousel-track">
                {recent.map((c, i) => {
                  const cfg = statusConfig[c.status] || statusConfig["Pending"];
                  const offset = i - carouselIndex;
                  const visible = Math.abs(offset) <= 1;
                  return (
                    <div
                      key={c._id}
                      className="carousel-card"
                      style={{
                        transform: `translateX(${offset * 105}%) scale(${offset===0 ? 1 : 0.88}) rotateY(${offset*-12}deg)`,
                        opacity: visible ? (offset===0 ? 1 : 0.5) : 0,
                        zIndex: offset===0 ? 10 : 5,
                        pointerEvents: offset===0 ? "auto" : "none",
                      }}
                    >
                      <div className="carousel-card-top" style={{ background: cfg.grad }}>
                        <i className={`fa-solid ${cfg.icon} carousel-card-icon`}></i>
                        <span className={`badge-premium ${getBadgeClass(c.status)}`} style={{ background:"rgba(221, 2, 0,0.15)", color:"#D9D9D9", border:"1px solid rgba(221, 2, 0,0.3)" }}>
                          {c.status}
                        </span>
                      </div>
                      <div className="carousel-card-body">
                        <h6 className="carousel-card-title">{c.title}</h6>
                        <p className="carousel-card-desc">{c.description}</p>
                        {c.status === "Rejected" && c.adminRemark && (
                          <div className="rejection-block-premium" style={{ fontSize:"0.78rem", marginBottom:"0.75rem" }}>
                            <i className="fa-solid fa-circle-exclamation me-1"></i>{c.adminRemark}
                          </div>
                        )}
                        <div style={{ display:"flex", gap:"0.5rem", flexWrap:"wrap", marginBottom:"0.75rem" }}>
                          <span style={{ fontSize:"0.75rem", background:"rgba(221, 2, 0,0.05)", padding:"2px 8px", borderRadius:99, color:"var(--text-muted)" }}>
                            {c.category}
                          </span>
                          <span style={{ fontSize:"0.75rem", background:"rgba(221, 2, 0,0.05)", padding:"2px 8px", borderRadius:99, color:"var(--text-muted)" }}>
                            {c.priority}
                          </span>
                        </div>
                        <button
                          className="btn-premium"
                          style={{ width:"100%", justifyContent:"center", fontSize:"0.82rem", padding:"0.5rem" }}
                          onClick={() => navigate(`/complaint/${c._id}`)}
                        >
                          <i className="fa-solid fa-timeline"></i>View Timeline
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Dots */}
            {recent.length > 0 && (
              <div style={{ display:"flex", justifyContent:"center", gap:"6px", marginTop:"1.5rem" }}>
                {recent.map((_,i) => (
                  <button
                    key={i}
                    onClick={() => setCarouselIndex(i)}
                    style={{
                      width: i===carouselIndex ? 20 : 6,
                      height:6,
                      borderRadius:99,
                      border:"none",
                      background: i===carouselIndex ? "var(--grad-primary)" : "rgba(221, 2, 0,0.15)",
                      cursor:"pointer",
                      transition:"all 0.3s",
                      padding:0,
                    }}
                  />
                ))}
              </div>
            )}

            {/* Quick actions */}
            <div className="quick-actions-premium">
              <button className="quick-action-card" onClick={() => navigate("/my-complaints")}>
                <i className="fa-solid fa-list fa-lg" style={{ color:"#DD0200" }}></i>
                <span>All Complaints</span>
              </button>
              <button className="quick-action-card" onClick={() => setShowSubmit(true)}>
                <i className="fa-solid fa-file-circle-plus fa-lg" style={{ color:"#DD0200" }}></i>
                <span>Submit New</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {showSubmit && (
        <SubmitComplaint onSuccess={fetchComplaints} onClose={() => setShowSubmit(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
