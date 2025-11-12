import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import TopBar from './components/layout/TopBar';
import DashboardPage from './pages/DashboardPage';
import KanbanPage from './pages/KanbanPage';
import LoginPage from './pages/LoginPage';
import Loader from './components/common/Loader';
import { getUser, logout as apiLogout } from './api';
import { User } from './types';
import './styles/global.css';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getUser()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = async () => {
    await apiLogout();
    setUser(null);
  };

  if (isLoading) return <Loader />;
  if (!user) return <LoginPage />;

  return (
    <BrowserRouter>
      <TopBar user={user} onLogout={logout} />
          <div>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
