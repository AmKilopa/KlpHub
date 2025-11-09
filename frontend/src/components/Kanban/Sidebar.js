import React, { useState } from "react";

export default function Sidebar({ addTask }) {
  const [input, setInput] = useState("");
  const [desc, setDesc] = useState("");

  const submit = () => {
    if (!input.trim()) return;
    addTask(input, desc);
    setInput("");
    setDesc("");
  };

  return (
    <div className="sidebar">
      <h3>Создать задачу</h3>
      <input
        className="sidebar-input"
        placeholder="Новая задача"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && submit()}
      />
      <textarea
        className="sidebar-input"
        placeholder="Описание"
        value={desc}
        onChange={e => setDesc(e.target.value)}
        rows={2}
      />
      <button onClick={submit}>Добавить</button>
    </div>
  );
}
