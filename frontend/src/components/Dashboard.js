import React from "react";
import { useNavigate } from "react-router-dom";

const modules = [{ name: "Kanban", route: "/kanban" }];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">KlpHub</h1>
      <div className="dashboard-buttons">
        {modules.map(m => (
          <button
            key={m.route}
            className="btn-primary"
            onClick={() => navigate(m.route)}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}
