import React from 'react';
import KanbanColumn from './KanbanColumn';
import '../../styles/KanbanBoard.css';

export default function KanbanBoard({
  tasks,
  api,
  selected,
  toggleSelect,
  isLoading,
  draggingTask,
  dragStartTask,
  dropTask,
}) {
  // Группируем задачи по columnname, включая 'todo'
  const plannedTasks = tasks.filter(t => t.columnname === "planned" || t.columnname === "todo");
  const inProgressTasks = tasks.filter(t => t.columnname === "inProgress");
  const doneTasks = tasks.filter(t => t.columnname === "done");

  return (
    <div className="kanban-board-area">
      <KanbanColumn
        title="В планах"
        colKey="planned"
        tasks={plannedTasks}
        api={api}
        selected={selected}
        toggleSelect={toggleSelect}
        isLoading={isLoading}
        draggingTask={draggingTask}
        dragStartTask={dragStartTask}
        dropTask={dropTask}
      />
      <KanbanColumn
        title="Делается"
        colKey="inProgress"
        tasks={inProgressTasks}
        api={api}
        selected={selected}
        toggleSelect={toggleSelect}
        isLoading={isLoading}
        draggingTask={draggingTask}
        dragStartTask={dragStartTask}
        dropTask={dropTask}
      />
      <KanbanColumn
        title="Сделано"
        colKey="done"
        tasks={doneTasks}
        api={api}
        selected={selected}
        toggleSelect={toggleSelect}
        isLoading={isLoading}
        draggingTask={draggingTask}
        dragStartTask={dragStartTask}
        dropTask={dropTask}
      />
    </div>
  );
}
