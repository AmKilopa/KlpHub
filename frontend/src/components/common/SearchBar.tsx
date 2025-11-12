import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Priority, PRIORITY_LABELS } from '../../types';
import '../../styles/components/SearchBar.css';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  priorityFilter: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
  showFilters: boolean;
  onToggleFilters: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  priorityFilter,
  onPriorityFilterChange,
  showFilters,
  onToggleFilters,
}) => {
  return (
    <div className="search-bar-container">
      <div className="search-bar">
        <Search size={20} className="search-icon" />
        <input
          type="text"
          placeholder="Поиск задач..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        {searchQuery && (
          <button className="search-clear" onClick={() => onSearchChange('')}>
            <X size={18} />
          </button>
        )}
        <button
          className={`search-filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={onToggleFilters}
        >
          <Filter size={18} />
        </button>
      </div>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label className="filter-label">Приоритет:</label>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${priorityFilter === 'all' ? 'active' : ''}`}
                onClick={() => onPriorityFilterChange('all')}
              >
                Все
              </button>
              <button
                className={`filter-btn priority-low ${priorityFilter === 'low' ? 'active' : ''}`}
                onClick={() => onPriorityFilterChange('low')}
              >
                {PRIORITY_LABELS.low}
              </button>
              <button
                className={`filter-btn priority-medium ${priorityFilter === 'medium' ? 'active' : ''}`}
                onClick={() => onPriorityFilterChange('medium')}
              >
                {PRIORITY_LABELS.medium}
              </button>
              <button
                className={`filter-btn priority-high ${priorityFilter === 'high' ? 'active' : ''}`}
                onClick={() => onPriorityFilterChange('high')}
              >
                {PRIORITY_LABELS.high}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
