import React from 'react';
import { Search, FileQuestion } from 'lucide-react';
import '../../styles/components/EmptyState.css';

interface EmptyStateProps {
  type: 'no-results' | 'no-tasks';
  searchQuery?: string;
  onReset?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ type, searchQuery, onReset }) => {
  if (type === 'no-results') {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Search size={64} />
          <div className="empty-state-glow"></div>
        </div>
        <h3 className="empty-state-title">Ничего не найдено</h3>
        <p className="empty-state-text">
          {searchQuery 
            ? `По запросу "${searchQuery}" задач не найдено`
            : 'Попробуйте изменить параметры поиска или фильтры'}
        </p>
        {onReset && (
          <button className="empty-state-button" onClick={onReset}>
            Сбросить фильтры
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <FileQuestion size={64} />
        <div className="empty-state-glow"></div>
      </div>
      <h3 className="empty-state-title">Задач пока нет</h3>
      <p className="empty-state-text">
        Создайте свою первую задачу, чтобы начать работу
      </p>
    </div>
  );
};

export default EmptyState;
