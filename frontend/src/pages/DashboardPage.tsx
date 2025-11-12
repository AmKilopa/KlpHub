import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/common/Button';
import '../styles/pages/DashboardPage.css';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Добро пожаловать в KlpHub</h1>
      <div className="dashboard-buttons">
        <Button onClick={() => navigate('/kanban')}>Перейти к Kanban</Button>
      </div>
    </div>
  );
};

export default DashboardPage;
