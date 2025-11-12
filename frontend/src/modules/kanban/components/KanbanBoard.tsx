import React from 'react';
import { Todo, ColumnKey } from '@types/index';
import KanbanColumn from './KanbanColumn';
import '@kanban/styles/KanbanBoard.css';

interface KanbanBoardProps {
  tasks: Todo[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (columnKey: string) => void;
}

const columns: { key: ColumnKey; title: string }[] = [
  { key: 'planned', title: 'В планах' },
  { key: 'inprogress', title: 'Делается' },
  { key: 'done', title: 'Сделано' },
];

const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  selected,
  onToggleSelect,
  onDelete,
  onEdit,
  onDragStart,
  onDrop,
}) => (
  <div className="kanban-board-area">
    {columns.map((col) => (
      <KanbanColumn
        key={col.key}
        title={col.title}
        columnKey={col.key}
        tasks={tasks.filter((t) => t.column_name === col.key)}
        selected={selected}
        onToggleSelect={onToggleSelect}
        onDelete={onDelete}
        onEdit={onEdit}
        onDragStart={onDragStart}
        onDrop={onDrop}
      />
    ))}
  </div>
);

export default KanbanBoard;
