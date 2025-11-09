import React from "react";

export default function Loader() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      <div className="spinner" style={{ position: "static" }} />
    </div>
  );
}
