import React, { useState } from 'react';
import KanbanTask from './KanbanTask';
import '../../styles/KanbanColumn.css';

export default function KanbanColumn({
  title,
  colKey,
  tasks,
  api,
  selected,
  toggleSelect,
  isLoading,
  draggingTask,
  dragStartTask,
  dropTask,
}) {
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = e => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDrop = e => {
    e.preventDefault();
    setDragOver(false);
    dropTask(colKey);
  };

  const handleDragLeave = () => setDragOver(false);

  return (
    <div
      className={`kanban-column${dragOver ? " drag-over" : ""}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      <div className="kanban-column-title">{title} ({tasks.length})</div>
      <div className="kanban-column-tasks">
        {tasks.map(task =>
          <KanbanTask
            key={task.id}
            task={task}
            colKey={colKey}
            api={api}
            selected={selected}
            toggleSelect={toggleSelect}
            isLoading={isLoading}
            draggingTask={draggingTask}
            dragStartTask={dragStartTask}
          />
        )}
      </div>
    </div>
  );
}
