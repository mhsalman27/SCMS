import React from "react";
import "./ComplaintCard.css";

const statusMap = {
  "Pending":     { cls:"badge-pending",   grad:"linear-gradient(135deg,#DD0200,#55100D)", icon:"fa-clock" },
  "In Progress": { cls:"badge-progress",  grad:"linear-gradient(135deg,#DD0200,#55100D)", icon:"fa-spinner" },
  "On Working":  { cls:"badge-onworking", grad:"linear-gradient(135deg,#DD0200,#DD0200)", icon:"fa-screwdriver-wrench" },
  "Resolved":    { cls:"badge-resolved",  grad:"linear-gradient(135deg,#DD0200,#55100D)", icon:"fa-circle-check" },
  "Rejected":    { cls:"badge-rejected",  grad:"linear-gradient(135deg,#DD0200,#55100D)", icon:"fa-circle-xmark" },
};

const ComplaintCard = ({ complaint, onViewTimeline, onEdit, onDelete, isAdmin, isEmployee, onUpdateStatus, onAssign, onReject }) => {
  const cfg     = statusMap[complaint.status] || statusMap["Pending"];
  const isPending  = complaint.status === "Pending";
  const isRejected = complaint.status === "Rejected";
  const isResolved = complaint.status === "Resolved";

  return (
    <div className={`cc-card ${isRejected?"cc-card--rejected":""}`}>
      {/* Top accent bar */}
      <div className="cc-top-bar" style={{ background: cfg.grad }}></div>

      {/* Header */}
      <div className="cc-header">
        <div className="cc-status-icon" style={{ background: cfg.grad }}>
          <i className={`fa-solid ${cfg.icon}`}></i>
        </div>
        <div style={{ flex:1, minWidth:0 }}>
          <h6 className="cc-title">{complaint.title}</h6>
          <span className={`badge-premium ${cfg.cls}`}>{complaint.status}</span>
        </div>
      </div>

      {/* Description */}
      <p className="cc-desc">{complaint.description}</p>

      {/* Meta */}
      <div className="cc-meta">
        <span><i className="fa-solid fa-tag me-1" style={{color:"#DD0200"}}></i>{complaint.category}</span>
        <span><i className="fa-solid fa-flag me-1" style={{color: complaint.priority==="High"?"#DD0200":complaint.priority==="Medium"?"#DD0200":"#D9D9D9"}}></i>{complaint.priority}</span>
        {complaint.assignedTo && <span><i className="fa-solid fa-user-tie me-1" style={{color:"#DD0200"}}></i>{complaint.assignedTo.username}</span>}
        {complaint.submittedBy && isAdmin && <span><i className="fa-solid fa-user me-1" style={{color:"#D9D9D9"}}></i>{complaint.submittedBy.username}</span>}
      </div>

      {/* Rejection remark */}
      {isRejected && complaint.adminRemark && (
        <div className="cc-rejection">
          <i className="fa-solid fa-circle-exclamation me-1"></i>
          <strong>Reason: </strong>{complaint.adminRemark}
        </div>
      )}

      {/* Image */}
      {complaint.imageUrl && (
        <img src={complaint.imageUrl} alt="Complaint" className="cc-image"/>
      )}

      {/* Action buttons */}
      <div className="cc-actions">
        {!isAdmin && !isEmployee && (
          <button className="cc-btn cc-btn-primary" onClick={() => onViewTimeline(complaint._id)}>
            <i className="fa-solid fa-timeline"></i>Timeline
          </button>
        )}
        {!isAdmin && !isEmployee && onEdit && isPending && (
          <button className="cc-btn cc-btn-ghost" onClick={() => onEdit(complaint)}>
            <i className="fa-solid fa-pen"></i>Edit
          </button>
        )}
        {!isAdmin && !isEmployee && onDelete && isPending && (
          <button className="cc-btn cc-btn-danger" onClick={() => onDelete(complaint._id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
        {isAdmin && onAssign && !isResolved && !isRejected && (
          <button className="cc-btn cc-btn-primary" onClick={() => onAssign(complaint)}>
            <i className="fa-solid fa-user-plus"></i>{complaint.assignedTo?"Re-Assign":"Assign"}
          </button>
        )}
        {isAdmin && onReject && !isResolved && !isRejected && (
          <button className="cc-btn cc-btn-danger-outline" onClick={() => onReject(complaint)}>
            <i className="fa-solid fa-ban"></i>Reject
          </button>
        )}
        {isAdmin && (
          <button className="cc-btn cc-btn-ghost" onClick={() => onViewTimeline && onViewTimeline(complaint._id)}>
            <i className="fa-solid fa-timeline"></i>
          </button>
        )}
        {isEmployee && !isResolved && (
          <button className="cc-btn cc-btn-success" onClick={() => onUpdateStatus(complaint)}>
            <i className="fa-solid fa-pen"></i>Update
          </button>
        )}
      </div>

      <p className="cc-date">{new Date(complaint.createdAt).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</p>
    </div>
  );
};
export default ComplaintCard;
