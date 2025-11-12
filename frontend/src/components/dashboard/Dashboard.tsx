import React from 'react';
import { User } from '../../types';

interface DashboardProps {
  user: User;
  tasksCount: {
    planned: number;
    inProgress: number;
    done: number;
  };
}

const Dashboard: React.FC<DashboardProps> = ({ user, tasksCount }) => {
  const total = tasksCount.planned + tasksCount.inProgress + tasksCount.done;
  
  return (
    <div className="dashboard">
      <h2>Привет, {user.display_name}!</h2>
      <div className="stats">
        <div className="stat-card">
          <span className="stat-label">Всего задач</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">В планах</span>
          <span className="stat-value">{tasksCount.planned}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">В работе</span>
          <span className="stat-value">{tasksCount.inProgress}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Завершено</span>
          <span className="stat-value">{tasksCount.done}</span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
