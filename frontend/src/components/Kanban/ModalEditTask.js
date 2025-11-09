import React from "react";
import Modal from "react-modal";

Modal.setAppElement('#root');

export default function ModalEditTask({
  editingId, editingText, editingDesc,
  setEditingText, setEditingDesc,
  closeModal, saveEditDesc
}) {
  return (
    <Modal isOpen={true} onRequestClose={closeModal}>
      <h2 style={{ marginBottom: 12 }}>Редактировать задачу</h2>
      <input
        className="sidebar-input"
        type="text"
        value={editingText}
        onChange={e => setEditingText(e.target.value)}
        placeholder="Название"
      />
      <textarea
        className="sidebar-input"
        value={editingDesc}
        onChange={e => setEditingDesc(e.target.value)}
        placeholder="Описание"
        rows={3}
      />
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={closeModal}>Отмена</button>
        <button onClick={() => saveEditDesc(editingId)}>Сохранить</button>
      </div>
    </Modal>
  );
}
