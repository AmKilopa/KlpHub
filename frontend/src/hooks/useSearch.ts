import { useState, useMemo } from 'react';
import { Todo, Priority } from '../types';

export const useSearch = (tasks: Todo[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Фильтр по поиску
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description?.toLowerCase().includes(query)
      );
    }

    // Фильтр по приоритету
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    return filtered;
  }, [tasks, searchQuery, priorityFilter]);

  const hasActiveFilters = searchQuery.trim() !== '' || priorityFilter !== 'all';

  return {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    showFilters,
    setShowFilters,
    filteredTasks,
    hasActiveFilters,
  };
};
