import React, { useEffect, useState } from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar, RadialBarChart, RadialBar
} from "recharts";
import { getDashboardStats, getAllEmployees } from "../../Services/ComplaintServices";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import toast from "react-hot-toast";
import "./AdminDashboard.css";

const GRADIENTS = [
  { id:"gPurple", c1:"#DD0200", c2:"#DD0200" },
  { id:"gCyan",   c1:"#DD0200", c2:"#55100D" },
  { id:"gGreen",  c1:"#DD0200", c2:"#55100D" },
  { id:"gRed",    c1:"#DD0200", c2:"#55100D" },
  { id:"gOrange", c1:"#DD0200", c2:"#55100D" },
];

const PIE_COLORS = ["#DD0200","#DD0200","#DD0200","#DD0200","#DD0200"];

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:"#55100D", border:"1px solid rgba(221, 2, 0,0.1)", borderRadius:10, padding:"8px 14px" }}>
      <p style={{ margin:0, fontWeight:700, color: payload[0].payload.fill || "#D9D9D9" }}>{payload[0].name}</p>
      <p style={{ margin:0, color:"#D9D9D9", fontSize:"0.85rem" }}>{payload[0].value} complaints</p>
    </div>
  );
};

const AdminDashboard = () => {
  const user      = JSON.parse(localStorage.getItem("scms"))?.user;
  const [stats,     setStats]     = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [s, e] = await Promise.all([getDashboardStats(), getAllEmployees()]);
        setStats(s.stats);
        setEmployees(e.employees);
      } catch(err) { toast.error(getErrorMessage(err)); }
      finally { setLoading(false); }
    })();
  }, []);

  if (loading) return (
    <div className="admin-db-page">
      <div className="loading-screen">
        <div className="loading-orb"></div>
        <p>Loading Dashboard...</p>
      </div>
    </div>
  );

  const total = stats?.totalComplaints || 1;
  const pieData = [
    { name:"Pending",     value: stats?.pendingCount    || 0, fill:"#DD0200" },
    { name:"In Progress", value: stats?.inProgressCount || 0, fill:"#DD0200" },
    { name:"On Working",  value: stats?.onWorkingCount  || 0, fill:"#DD0200" },
    { name:"Resolved",    value: stats?.resolvedCount   || 0, fill:"#DD0200" },
    { name:"Rejected",    value: stats?.rejectedCount   || 0, fill:"#DD0200" },
  ];

  const barData = pieData.map(d => ({ name: d.name, count: d.value }));

  const statCards = [
    { label:"Total Users",      value: stats?.totalUsers,      icon:"fa-users",             grad:"linear-gradient(135deg,#DD0200,#DD0200)", glow:"rgba(221,2,0,0.3)" },
    { label:"Total Complaints", value: stats?.totalComplaints, icon:"fa-inbox",             grad:"linear-gradient(135deg,#DD0200,#DD0200)", glow:"rgba(221,2,0,0.3)" },
    { label:"Pending",          value: stats?.pendingCount,    icon:"fa-clock",             grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)" },
    { label:"In Progress",      value: stats?.inProgressCount, icon:"fa-spinner",           grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)"  },
    { label:"On Working",       value: stats?.onWorkingCount,  icon:"fa-screwdriver-wrench",grad:"linear-gradient(135deg,#DD0200,#DD0200)", glow:"rgba(221,2,0,0.3)" },
    { label:"Resolved",         value: stats?.resolvedCount,   icon:"fa-circle-check",      grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)" },
    { label:"Rejected",         value: stats?.rejectedCount,   icon:"fa-circle-xmark",      grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)"  },
    { label:"Employees",        value: stats?.employeeCount,   icon:"fa-user-tie",          grad:"linear-gradient(135deg,#DD0200,#7c3aed)", glow:"rgba(139,92,246,0.3)" },
  ];

  const resolution = total > 0 ? Math.round(((stats?.resolvedCount||0)/total)*100) : 0;

  return (
    <div className="admin-db-page">

      <div className="db-container">
        {/* Header */}
        <div className="db-header animate-fade-up">
          <div>
            <h2 style={{ fontWeight:900, marginBottom:4 }}>
              Admin <span className="glow-text">Command Centre</span>
            </h2>
            <p style={{ color:"var(--text-muted)", margin:0, fontSize:"0.9rem" }}>
              Welcome back, <strong style={{ color:"#DD0200" }}>{user?.username}</strong> — here's your live overview
            </p>
          </div>
          <div className="resolution-ring">
            <svg viewBox="0 0 80 80" style={{ width:80, height:80 }}>
              <defs>
                <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#DD0200"/>
                  <stop offset="100%" stopColor="#55100D"/>
                </linearGradient>
              </defs>
              <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(221, 2, 0,0.07)" strokeWidth="6"/>
              <circle cx="40" cy="40" r="34" fill="none" stroke="url(#ringGrad)" strokeWidth="6"
                strokeDasharray={`${2*Math.PI*34}`}
                strokeDashoffset={`${2*Math.PI*34*(1-resolution/100)}`}
                strokeLinecap="round"
                transform="rotate(-90 40 40)"
                style={{ transition:"stroke-dashoffset 1s ease" }}
              />
              <text x="40" y="38" textAnchor="middle" fill="#DD0200" fontSize="14" fontWeight="800" fontFamily="Space Grotesk">{resolution}%</text>
              <text x="40" y="52" textAnchor="middle" fill="#D9D9D9" fontSize="8" fontFamily="Inter">Resolved</text>
            </svg>
          </div>
        </div>

        {/* STAT CARDS */}
        <div className="stat-cards-grid">
          {statCards.map((s, i) => (
            <div key={s.label} className="stat-card-premium animate-fade-up" style={{ animationDelay:`${i*0.05}s` }}>
              <div className="stat-card-glow" style={{ background: s.glow }}></div>
              <div className="stat-icon-premium" style={{ background: s.grad }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <div className="stat-body">
                <span className="stat-val">{s.value ?? 0}</span>
                <span className="stat-lbl">{s.label}</span>
              </div>
              <div className="stat-bar" style={{ background: s.grad }}></div>
            </div>
          ))}
        </div>

        {/* CHARTS ROW */}
        <div className="charts-row animate-fade-up" style={{ animationDelay:"0.3s" }}>

          {/* PIE CHART */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h5>Status Distribution</h5>
              <span className="chart-badge">{total} total</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <defs>
                  {GRADIENTS.map(g => (
                    <linearGradient key={g.id} id={g.id} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={g.c1}/>
                      <stop offset="100%" stopColor={g.c2}/>
                    </linearGradient>
                  ))}
                </defs>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={70} outerRadius={110}
                  paddingAngle={4}
                  dataKey="value"
                  onMouseEnter={(_,i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {pieData.map((d, i) => (
                    <Cell key={i} fill={d.fill}
                      stroke="transparent"
                      opacity={activeIndex === null || activeIndex === i ? 1 : 0.4}
                      style={{ cursor:"pointer", filter: activeIndex===i ? `drop-shadow(0 0 8px ${d.fill})` : "none", transition:"all 0.2s" }}
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ color:"#D9D9D9", fontSize:"0.8rem" }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* BAR CHART */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h5>Complaint Breakdown</h5>
              <span className="chart-badge">By Status</span>
            </div>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={barData} margin={{ top:10, right:10, left:-20, bottom:0 }}>
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#DD0200"/>
                    <stop offset="100%" stopColor="#DD0200" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(221, 2, 0,0.05)" vertical={false}/>
                <XAxis dataKey="name" tick={{ fill:"#D9D9D9", fontSize:11 }} axisLine={false} tickLine={false}/>
                <YAxis tick={{ fill:"#D9D9D9", fontSize:11 }} axisLine={false} tickLine={false}/>
                <Tooltip
                  contentStyle={{ background:"#55100D", border:"1px solid rgba(221, 2, 0,0.1)", borderRadius:10, color:"#D9D9D9" }}
                  cursor={{ fill:"rgba(221, 2, 0,0.04)" }}
                />
                <Bar dataKey="count" fill="url(#barGrad)" radius={[6,6,0,0]}>
                  {barData.map((d, i) => <Cell key={i} fill={PIE_COLORS[i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* BOTTOM ROW: Progress bars + employees */}
        <div className="bottom-row animate-fade-up" style={{ animationDelay:"0.4s" }}>

          {/* Progress section */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h5>Resolution Progress</h5>
            </div>
            <div style={{ padding:"0.5rem 0" }}>
              {pieData.map((d) => {
                const pct = total > 0 ? Math.round((d.value/total)*100) : 0;
                return (
                  <div key={d.name} style={{ marginBottom:"1.2rem" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.82rem", marginBottom:6 }}>
                      <span style={{ color:"var(--text-secondary)", fontWeight:500 }}>{d.name}</span>
                      <span style={{ color:d.fill, fontWeight:700 }}>{d.value} <span style={{ color:"var(--text-muted)" }}>({pct}%)</span></span>
                    </div>
                    <div style={{ background:"rgba(221, 2, 0,0.06)", borderRadius:99, height:8, overflow:"hidden" }}>
                      <div style={{
                        height:"100%", width:`${pct}%`,
                        background: d.fill,
                        borderRadius:99,
                        boxShadow:`0 0 10px ${d.fill}`,
                        transition:"width 1s ease",
                      }}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Employees */}
          <div className="chart-card">
            <div className="chart-card-header">
              <h5>Employees</h5>
              <span className="chart-badge">{employees.length} active</span>
            </div>
            <div className="employees-list-premium">
              {employees.length === 0 ? (
                <div style={{ textAlign:"center", padding:"2rem", color:"var(--text-muted)" }}>
                  <i className="fa-solid fa-user-tie fa-2x mb-2"></i>
                  <p>No employees yet</p>
                </div>
              ) : employees.map((emp, i) => (
                <div key={emp._id} className="emp-row-premium" style={{ animationDelay:`${i*0.06}s` }}>
                  <div className="emp-av-premium">
                    {emp.username[0].toUpperCase()}
                  </div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:600, fontSize:"0.87rem" }}>{emp.username}</div>
                    <div style={{ fontSize:"0.74rem", color:"var(--text-muted)" }}>{emp.email}</div>
                  </div>
                  <div style={{ width:8, height:8, borderRadius:"50%", background:"#DD0200", boxShadow:"0 0 8px #DD0200" }}></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
