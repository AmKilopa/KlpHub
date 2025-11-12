import React from 'react';
import { CheckSquare, Square, Trash2 } from 'lucide-react';
import '@kanban/styles/KanbanActions.css';

interface KanbanActionsProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: () => void;
  onDeleteSelected: () => void;
}

const KanbanActions: React.FC<KanbanActionsProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onDeleteSelected,
}) => {
  if (totalCount === 0) return null;

  const allSelected = selectedCount === totalCount;

  return (
    <div className="kanban-actions">
      <button className="kanban-action-btn" onClick={onSelectAll}>
        {allSelected ? <CheckSquare size={18} /> : <Square size={18} />}
        <span>{allSelected ? 'Снять выделение' : 'Выбрать все'}</span>
      </button>
      {selectedCount > 0 && (
        <button className="kanban-action-btn kanban-action-danger" onClick={onDeleteSelected}>
          <Trash2 size={18} />
          <span>Удалить выбранные ({selectedCount})</span>
        </button>
      )}
    </div>
  );
};

export default KanbanActions;
