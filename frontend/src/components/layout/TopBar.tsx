import React from 'react';
import { LogOut } from 'lucide-react';
import { User } from '../../types';
import '../../styles/components/TopBar.css';

interface TopBarProps {
  user: User;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ user, onLogout }) => (
  <div className="topbar">
    <div className="left-side">
      <img src={user.photo || '/default-avatar.png'} alt="Avatar" className="topbar-avatar" />
      <span className="topbar-username">{user.display_name}</span>
    </div>
    <div className="topbar-center">KlpHub</div>
    <button onClick={onLogout} className="topbar-logout">
      <LogOut size={18} style={{ marginRight: 6 }} />
      Выйти
    </button>
  </div>
);

export default TopBar;
