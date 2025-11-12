import React, { useState } from 'react';
import { ColumnKey } from '../../types';
import KanbanTask from './KanbanTask';
import '../../styles/components/KanbanColumn.css';

interface KanbanColumnProps {
  title: string;
  columnKey: ColumnKey;
  tasks: any[];
  selected: string[];
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
  onDrop: (columnKey: string) => void;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({
  title,
  columnKey,
  tasks,
  selected,
  onToggleSelect,
  onDelete,
  onEdit,
  onDragStart,
  onDrop,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    onDrop(columnKey);
  };

  return (
    <div
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="kanban-column-header">
        <h3 className="kanban-column-title">{title}</h3>
        <span className="kanban-column-count">{tasks.length}</span>
      </div>
      <div className="kanban-tasks-list">
        {tasks.length === 0 ? (
          <div className="kanban-empty-state">Задач пока нет</div>
        ) : (
          tasks.map((task) => (
            <KanbanTask
              key={task.id}
              task={task}
              isSelected={selected.includes(task.id)}
              onToggleSelect={onToggleSelect}
              onDelete={onDelete}
              onEdit={onEdit}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
