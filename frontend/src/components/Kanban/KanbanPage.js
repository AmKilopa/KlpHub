import React from "react";
// 1. ИСПРАВЛЕНИЕ: Используем { useKanban } (именной импорт)
import { useKanban } from "./useKanban";
import KanbanBoard from "./KanbanBoard";
import Sidebar from "./Sidebar";
import ModalEditTask from "./ModalEditTask";
import Loader from "./Loader";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function KanbanPage() {
  const kanban = useKanban();
  // 2. ИСПРАВЛЕНИЕ: kanban.todos -> kanban.tasks
  const filteredTasks = kanban.tasks;

  return (
    // Классы container и container--tight не определены в global.css,
    // но я оставлю их, предполагая, что они у вас есть
    <div className="container container--tight" style={{ display: 'flex', gap: '16px', padding: '16px' }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Sidebar ожидает addTask, который теперь в kanban.api */}
      <Sidebar addTask={kanban.api.addTask} />
      
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
        <div className="controls" style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => kanban.selectAll(filteredTasks)}>
            {filteredTasks.length === kanban.selected.length ? "Сбросить выделение" : "Выделить все"}
          </button>
          <button
            disabled={!kanban.selected.length}
            className="btn-danger" // Используем класс из global.css
            onClick={kanban.removeSelected}
          >
            Удалить выбранные
          </button>
        </div>
        
        {/* KanbanBoard ожидает все пропсы kanban (tasks, columns, api, selected, openModal...) */}
        <KanbanBoard {...kanban} />
      </div>

      {kanban.isLoading && <Loader />}

      {kanban.modalOpen && (
        <ModalEditTask
          // Все эти пропсы теперь снова существуют в хуке
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