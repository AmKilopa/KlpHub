import React from "react";
import "../styles/global.css";
import "../styles/AccountPanel.css";

export default function AccountPanel({ user, onLogout }) {
  return (
    <div className="account-panel">
      <div className="user-info">
        {user?.photo && (
          <img
            src={user.photo}
            alt="Avatar"
            className="account-avatar"
          />
        )}
        <span className="user-name">{user?.displayName || "Пользователь"}</span>
      </div>
      <button className="btn-secondary" onClick={onLogout}>Выйти</button>
    </div>
  );
}
