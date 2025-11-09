import React from "react";
import { useKanban } from "./useKanban";
import KanbanBoard from "./KanbanBoard";
import Sidebar from "./Sidebar";
import ModalEditTask from "./ModalEditTask";
import Loader from "./Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KanbanPage() {
  const kanban = useKanban();
  const filteredTasks = kanban.tasks;

  return (
    <div className="container container--tight" style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Sidebar addTask={kanban.api.addTask} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="controls" style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => kanban.selectAll(filteredTasks)}>
            {filteredTasks.length === kanban.selected.length ? "Сбросить выделение" : "Выделить все"}
          </button>
          <button
            disabled={!kanban.selected.length}
            className="btn-danger"
            onClick={kanban.removeSelected}
          >
            Удалить выбранные
          </button>
        </div>
        <KanbanBoard {...kanban} />
      </div>
      {kanban.isLoading && <Loader />}
      {kanban.modalOpen && (
        <ModalEditTask
          editingId={kanban.editingId}
          editingText={kanban.editingText}
          editingDesc={kanban.editingDesc}
          setEditingText={kanban.setEditingText}
          setEditingDesc={kanban.setEditingDesc}
          closeModal={kanban.closeModal}
          saveEditDesc={kanban.saveEditDesc}
        />
      )}
    </div>
  );
}
