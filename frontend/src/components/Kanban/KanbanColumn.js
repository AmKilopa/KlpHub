import React, { useState } from "react";
import KanbanTask from "./KanbanTask";

export default function KanbanColumn({ col, tasks, ...props }) {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = e => { e.preventDefault(); setIsOver(true); };
  const handleDragLeave = () => setIsOver(false);
  const handleDrop = e => { e.preventDefault(); setIsOver(false); props.dropTask(col.key); };

  return (
    <div className="kanban-column">
      <h3 className="kanban-column__title">{col.name} ({tasks.length})</h3>
      <div
        className={`kanban-column__tasks ${isOver ? "is-over" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {tasks.map(task => (
          <KanbanTask key={task.id} task={task} colKey={col.key} {...props} />
        ))}
      </div>
    </div>
  );
}
