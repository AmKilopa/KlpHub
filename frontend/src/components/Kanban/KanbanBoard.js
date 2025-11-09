import React from "react";
import KanbanColumn from "./KanbanColumn";

const COLUMNS = [
  { key: "todo",       name: "В планах" },
  { key: "inprogress", name: "Делается" },
  { key: "done",       name: "Сделано" },
];

export default function KanbanBoard(props) {
  return (
    <div className="kanban-board" style={{ display: 'flex', gap: '16px' }}>
      {COLUMNS.map(col => (
        <KanbanColumn
          key={col.key}
          col={col}
          //
          // ИСПРАВЛЕНИЕ: Было props.todos, стало props.tasks
          //
          tasks={props.tasks.filter(t => t.columnname === col.key)}
          {...props}
        />
      ))}
    </div>
  );
}