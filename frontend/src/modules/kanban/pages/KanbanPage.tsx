import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { useToast } from '@hooks/useToast';
import { useKanban } from '@kanban/hooks/useKanban';
import { useSearch } from '@kanban/hooks/useSearch';
import SkeletonLoader from '@common/SkeletonLoader';
import Sidebar from '@common/Sidebar';
import SearchBar from '@common/SearchBar';
import KanbanBoard from '@kanban/components/KanbanBoard';
import KanbanActions from '@kanban/components/KanbanActions';
import EmptyState from '@common/EmptyState';
import Modal from '@common/Modal';
import ConfirmModal from '@common/ConfirmModal';
import Toast from '@common/Toast';
import PrioritySelector from '@common/PrioritySelector';
import Button from '@common/Button';
import { Priority } from '@types/index';
import '@kanban/styles/KanbanPage.css';

const KanbanPage: React.FC = () => {
  const { toasts, showToast, removeToast } = useToast();
  const {
    tasks,
    isLoading,
    api,
    selected,
    toggleSelect,
    selectAll,
    dragStartTask,
    dropTask,
    openModal,
    modalOpen,
    closeModal,
    editingId,
    editingText,
    editingDesc,
    setEditingText,
    setEditingDesc,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    confirmDeleteSelectedOpen,
    setConfirmDeleteSelectedOpen,
  } = useKanban(showToast);

  const {
    searchQuery,
    setSearchQuery,
    priorityFilter,
    setPriorityFilter,
    showFilters,
    setShowFilters,
    filteredTasks,
    hasActiveFilters,
  } = useSearch(tasks);

  const [editingPriority, setEditingPriority] = useState<Priority>('medium');

  const handleOpenModal = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (task) {
      setEditingPriority(task.priority || 'medium');
    }
    openModal(id);
  };

  const handleSave = () => {
    if (!editingId) return;
    api.updateTaskContent(editingId, editingText, editingDesc, editingPriority);
    closeModal();
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setPriorityFilter('all');
  };

  if (isLoading) return <SkeletonLoader />;

  return (
    <>
      <div className="kanban-layout">
        <Sidebar onAddTask={(title, desc, column, priority) => api.addTask(title, desc, column, priority)} />
        <div className="kanban-main">
          <div className="kanban-toolbar">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
              showFilters={showFilters}
              onToggleFilters={() => setShowFilters(!showFilters)}
            />
            <KanbanActions
              selectedCount={selected.length}
              totalCount={tasks.length}
              onSelectAll={selectAll}
              onDeleteSelected={api.deleteSelected}
            />
          </div>

          {hasActiveFilters && filteredTasks.length === 0 ? (
            <EmptyState
              type="no-results"
              searchQuery={searchQuery}
              onReset={handleResetFilters}
            />
          ) : (
            <KanbanBoard
              tasks={filteredTasks}
              selected={selected}
              onToggleSelect={toggleSelect}
              onDelete={api.deleteTask}
              onEdit={handleOpenModal}
              onDragStart={dragStartTask}
              onDrop={dropTask}
            />
          )}
        </div>
      </div>

      <div className="toast-container">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title="Редактировать задачу">
        <input
          type="text"
          className="modal-input"
          placeholder="Название задачи"
          value={editingText}
          onChange={(e) => setEditingText(e.target.value)}
          maxLength={100}
        />
        <textarea
          className="modal-input modal-textarea"
          placeholder="Описание задачи"
          value={editingDesc}
          onChange={(e) => setEditingDesc(e.target.value)}
          maxLength={500}
        />
        <PrioritySelector value={editingPriority} onChange={setEditingPriority} />
        <div className="modal-actions">
          <button onClick={closeModal} className="btn-secondary">
            <X size={18} style={{ marginRight: 6 }} />
            Отмена
          </button>
          <Button onClick={handleSave}>
            <Save size={18} style={{ marginRight: 6 }} />
            Сохранить
          </Button>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
        onConfirm={api.confirmDelete}
        title="Подтверждение удаления"
        message="Вы уверены, что хотите удалить эту задачу? Это действие нельзя отменить."
        confirmText="Удалить"
        cancelText="Отмена"
      />

      <ConfirmModal
        isOpen={confirmDeleteSelectedOpen}
        onClose={() => setConfirmDeleteSelectedOpen(false)}
        onConfirm={api.confirmDeleteSelected}
        title="Подтверждение удаления"
        message={`Вы уверены, что хотите удалить выбранные задачи (${selected.length})? Это действие нельзя отменить.`}
        confirmText="Удалить все"
        cancelText="Отмена"
      />
    </>
  );
};

export default KanbanPage;
