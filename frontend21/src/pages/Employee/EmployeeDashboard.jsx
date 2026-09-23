import React, { useEffect, useState } from "react";
import { getAssignedComplaints, getResolvedComplaints } from "../../Services/ComplaintServices";
import { getErrorMessage } from "../../Utils/ErrorMessage";
import ComplaintCard from "../../components/ComplaintCard/ComplaintCard";
import UpdateStatus from "../../components/UpdateStatus";
import Spinner from "../../components/Spinner";
import toast from "react-hot-toast";
import "./EmployeeDashboard.css";

const EmployeeDashboard = () => {
  const user   = JSON.parse(localStorage.getItem("scms"))?.user;
  const [assigned,     setAssigned]     = useState([]);
  const [resolvedCount,setResolvedCount]= useState(0);
  const [loading,      setLoading]      = useState(true);
  const [updateTarget, setUpdateTarget] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [a, r] = await Promise.all([getAssignedComplaints(), getResolvedComplaints()]);
      setAssigned(a.complaints);
      setResolvedCount(r.complaints.length);
    } catch(e) { toast.error(getErrorMessage(e)); }
    finally { setLoading(false); }
  };

  const onWorking = assigned.filter(c=>c.status==="On Working").length;

  const stats = [
    { label:"Assigned",   value: assigned.length,  icon:"fa-clipboard-list",       grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)" },
    { label:"On Working", value: onWorking,         icon:"fa-screwdriver-wrench",   grad:"linear-gradient(135deg,#DD0200,#DD0200)", glow:"rgba(221,2,0,0.3)" },
    { label:"Resolved",   value: resolvedCount,     icon:"fa-circle-check",         grad:"linear-gradient(135deg,#DD0200,#55100D)", glow:"rgba(221,2,0,0.3)" },
  ];

  return (
    <div className="emp-db-page">

      <div className="emp-db-container" style={{ position:"relative", zIndex:1 }}>
        {/* Header */}
        <div style={{ marginBottom:"2rem" }}>
          <h2 style={{ fontWeight:900, marginBottom:4 }}>
            Employee <span className="glow-text">Dashboard</span>
          </h2>
          <p style={{ color:"var(--text-muted)", margin:0, fontSize:"0.9rem" }}>
            Hello, <strong style={{ color:"#DD0200" }}>{user?.username}</strong> 👋 Manage your assigned complaints
          </p>
        </div>

        {/* Stat Cards */}
        <div className="emp-stats-row">
          {stats.map(s => (
            <div key={s.label} className="emp-sc">
              <div className="emp-sc-icon" style={{ background: s.grad, boxShadow:`0 4px 15px ${s.glow}` }}>
                <i className={`fa-solid ${s.icon}`}></i>
              </div>
              <div>
                <div className="emp-sc-val">{loading ? "—" : s.value}</div>
                <div className="emp-sc-lbl">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Assigned complaints */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
          <h5 style={{ fontWeight:800, margin:0 }}>
            <i className="fa-solid fa-clipboard-list me-2" style={{ color:"#DD0200" }}></i>
            Assigned to Me
          </h5>
        </div>

        {loading ? <Spinner/> : assigned.length===0 ? (
          <div style={{ textAlign:"center", padding:"5rem 1rem", background:"rgba(221, 2, 0,0.02)", border:"1px solid var(--border)", borderRadius:16, color:"var(--text-muted)" }}>
            <i className="fa-solid fa-inbox fa-3x" style={{ marginBottom:"1rem", display:"block" }}></i>
            <h5 style={{ color:"var(--text-secondary)" }}>No complaints assigned yet</h5>
            <p style={{ fontSize:"0.85rem" }}>New assignments will appear here when admin assigns them.</p>
          </div>
        ) : (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"1rem" }}>
            {assigned.map(c=>(
              <ComplaintCard key={c._id} complaint={c}
                isEmployee={true}
                onUpdateStatus={c=>setUpdateTarget(c)}
              />
            ))}
          </div>
        )}
      </div>

      {updateTarget && (
        <UpdateStatus complaint={updateTarget} onSuccess={fetchData} onClose={()=>setUpdateTarget(null)}/>
      )}
    </div>
  );
};
export default EmployeeDashboard;
