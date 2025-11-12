import React, { useRef, useState } from 'react';
import { Trash2, GripVertical } from 'lucide-react';
import { Todo, PRIORITY_COLORS } from '@types/index';
import { formatDate } from '@utils/helpers';
import '@kanban/styles/KanbanTask.css';

interface KanbanTaskProps {
  task: Todo;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
  onDragStart: (e: React.DragEvent, id: string) => void;
}

const KanbanTask: React.FC<KanbanTaskProps> = ({
  task,
  isSelected,
  onToggleSelect,
  onDelete,
  onEdit,
  onDragStart,
}) => {
  const taskRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const isDone = task.column_name === 'done';
  const priorityColor = PRIORITY_COLORS[task.priority || 'medium'];

  const handleDragStart = (e: React.DragEvent) => {
    if (task.isLoading) return;
    
    setIsDragging(true);
    
    if (taskRef.current) {
      const rect = taskRef.current.getBoundingClientRect();
      const clone = taskRef.current.cloneNode(true) as HTMLElement;
      
      clone.style.position = 'absolute';
      clone.style.top = '-9999px';
      clone.style.left = '-9999px';
      clone.style.width = `${rect.width}px`;
      clone.style.opacity = '1';
      clone.style.transform = 'rotate(5deg) scale(1.08)';
      clone.style.boxShadow = '0 16px 48px rgba(83, 155, 245, 0.6), 0 0 60px rgba(83, 155, 245, 0.4)';
      clone.style.pointerEvents = 'none';
      clone.style.zIndex = '9999';
      clone.style.border = '2px solid var(--color-accent)';
      clone.style.background = 'linear-gradient(145deg, rgba(83, 155, 245, 0.2) 0%, rgba(83, 155, 245, 0.15) 100%)';
      clone.style.animation = 'dragWiggle 0.4s ease-in-out infinite';
      
      const styleSheet = document.createElement('style');
      styleSheet.textContent = `
        @keyframes dragWiggle {
          0%, 100% { transform: rotate(3deg) scale(1.08); }
          50% { transform: rotate(-3deg) scale(1.08); }
        }
      `;
      document.head.appendChild(styleSheet);
      
      document.body.appendChild(clone);
      
      e.dataTransfer.setDragImage(clone, rect.width / 2, rect.height / 2);
      
      setTimeout(() => {
        if (document.body.contains(clone)) {
          document.body.removeChild(clone);
        }
        if (document.head.contains(styleSheet)) {
          document.head.removeChild(styleSheet);
        }
      }, 0);
    }
    
    onDragStart(e, task.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleEdit = () => {
    if (!task.isLoading && !isDone) {
      onEdit(task.id);
    }
  };

  return (
    <div
      ref={taskRef}
      className={`kanban-task ${task.isLoading ? 'loading' : ''} ${isSelected ? 'selected' : ''} ${isDragging ? 'is-dragging' : ''} ${isDone ? 'done' : ''}`}
      draggable={!task.isLoading}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      style={{ '--task-priority-color': priorityColor } as React.CSSProperties}
    >
      {task.isLoading && <div className="mini-loader" />}
      
      {/* Цветная полоска приоритета */}
      <div className="task-priority-bar" style={{ backgroundColor: priorityColor }} />
      
      <div className="task-drag-handle">
        <GripVertical size={18} className="drag-icon" />
      </div>

      <div className="task-checkbox-wrapper">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(task.id)}
          className="kanban-task-checkbox"
          disabled={task.isLoading}
        />
        <span className="checkbox-custom"></span>
      </div>

      <div className="kanban-task-content" onClick={handleEdit} style={{ cursor: isDone ? 'default' : 'pointer' }}>
        <div className="task-title">{task.title}</div>
        {task.description && <div className="task-desc">{task.description}</div>}
        {task.created_at && <div className="task-timestamp">{formatDate(task.created_at)}</div>}
      </div>

      {!task.isLoading && (
        <button className="delete-button" onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}>
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default KanbanTask;
