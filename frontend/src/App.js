import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccountPanel from "./components/AccountPanel";
import Dashboard from "./components/Dashboard";
import KanbanPage from "./components/Kanban/KanbanPage";
import { getUser, logout as apiLogout, getGithubLoginUrl } from "./api";
import "./global.css";

const FullPageLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0d1117' }}>
    <h2 style={{ color: '#e6edf3' }}>Загрузка...</h2>
  </div>
);

const LoginPage = () => (
  <div style={{ textAlign: "center", marginTop: 80 }}>
    <h1 style={{ marginBottom: 16 }}>KlpHub</h1>
    <button onClick={() => (window.location.href = getGithubLoginUrl())} className="btn-github">
      Войти через GitHub
    </button>
  </div>
);

export default function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await getUser();
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  if (isLoading) return <FullPageLoader />;
  if (!user) return <LoginPage />;

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
