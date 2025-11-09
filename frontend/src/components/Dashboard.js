import React from "react";
import { useNavigate } from "react-router-dom";

const modules = [{ name: "Kanban", route: "/kanban" }];

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div style={{
      maxWidth: 700, margin: "40px auto",
      background: "#17181a", border: "1px solid #2a2b2e",
      borderRadius: 12, padding: 24, textAlign: "center"
    }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, color: "#fff", marginBottom: 22 }}>KlpHub</h1>
      <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
        {modules.map(m => (
          <button
            key={m.route}
            onClick={() => navigate(m.route)}
            style={{
              padding: "14px 26px", background: "#1f2023",
              border: "1px solid #32343a", borderRadius: 10,
              color: "#fff", fontWeight: 700, cursor: "pointer"
            }}
          >
            {m.name}
          </button>
        ))}
      </div>
    </div>
  );
}
