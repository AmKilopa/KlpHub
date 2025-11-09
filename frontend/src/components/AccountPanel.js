import React from "react";

export default function AccountPanel({ user, onLogout }) {
  return (
    <div className="account-panel">
      <span>{user?.displayName}</span>
      {user?.photo && (
        <img
          src={user.photo}
          alt="Avatar"
          style={{ width: 34, height: 34, borderRadius: "50%", boxShadow: "0 2px 8px #000" }}
        />
      )}
      <button onClick={onLogout}>Выйти</button>
    </div>
  );
}
