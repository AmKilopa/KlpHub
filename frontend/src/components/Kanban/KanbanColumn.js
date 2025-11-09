import React from "react";
import KanbanTask from "./KanbanTask";

export default function KanbanColumn(props) {
  const { col, tasks } = props;
  return (
    <div
      className="kanban-column"
      onDragOver={props.dragOverColumn}
      onDrop={e => props.dropOnColumn(e, col.key)}
    >
      <h3>{col.name}</h3>
      {tasks.map(task => (
        <KanbanTask
          key={task.id}
          task={task}
          colKey={col.key}
          {...props}   // тут есть updateTaskTitleDesc из useKanban
        />
      ))}
    </div>
  );
}
