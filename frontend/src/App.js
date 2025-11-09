import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountPanel from "./components/AccountPanel";
import Dashboard from "./components/Dashboard";
import KanbanPage from "./components/Kanban/KanbanPage";
import { getUser, logout as apiLogout } from "./api/kanbanApi";
import "./global.css";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => { getUser().then(res => setUser(res.data)); }, []);
  const logout = () => apiLogout().then(() => setUser(null));

  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: 80 }}>
        <h1 style={{ marginBottom: 16 }}>GitHub OAuth Demo</h1>
        <button
          onClick={() => (window.location.href = "http://localhost:5000/auth/github")}
          style={{
            background: "#1f2023", color: "#fff", border: "1px solid #32343a",
            padding: "10px 16px", borderRadius: 8, fontWeight: 700, cursor: "pointer"
          }}
        >
          Войти через GitHub
        </button>
      </div>
    );

  return (
    <BrowserRouter>
      <AccountPanel user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/kanban" element={<KanbanPage />} />
      </Routes>
    </BrowserRouter>
  );
}
