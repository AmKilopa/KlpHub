import React from 'react';
import { Priority, PRIORITY_LABELS, PRIORITY_COLORS } from '../../types';
import '../../styles/components/PrioritySelector.css';

interface PrioritySelectorProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

const PrioritySelector: React.FC<PrioritySelectorProps> = ({ value, onChange }) => {
  const priorities: Priority[] = ['low', 'medium', 'high'];

  return (
    <div className="priority-selector">
      <label className="priority-label">Приоритет</label>
      <div className="priority-options">
        {priorities.map((priority) => (
          <button
            key={priority}
            type="button"
            className={`priority-option ${value === priority ? 'active' : ''}`}
            onClick={() => onChange(priority)}
            style={{
              '--priority-color': PRIORITY_COLORS[priority],
            } as React.CSSProperties}
          >
            <span className="priority-indicator" style={{ backgroundColor: PRIORITY_COLORS[priority] }} />
            <span className="priority-name">{PRIORITY_LABELS[priority]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default PrioritySelector;
