import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, moveTask } from '@kanban/api/kanbanApi';
import { Todo, Priority } from '@types/index';

const pluralize = (count: number, one: string, few: string, many: string): string => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few;
  return many;
};

export const useKanban = (showToast: (msg: string, type?: 'success' | 'error' | 'warning') => void) => {
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmDeleteSelectedOpen, setConfirmDeleteSelectedOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [draggingTask, setDraggingTask] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchTasks = () => {
    setIsLoading(true);
    getTasks()
      .then((res) => setTasks(res.data))
      .catch(() => showToast('Ошибка загрузки задач', 'error'))
      .finally(() => setIsLoading(false));
  };

  const api = {
    addTask: async (title: string, desc = '', column = 'planned', priority: Priority = 'medium') => {
      const tempId = Math.random().toString(36);
      setTasks((current) => [
        ...current,
        { 
          id: tempId, 
          title, 
          description: desc, 
          column_name: column as any, 
          user_id: '', 
          priority, 
          isLoading: true 
        },
      ]);
      try {
        const res = await createTask(title, column, desc, priority);
        setTasks((current) => current.filter((t) => t.id !== tempId).concat(res.data));
        showToast('Задача создана');
        return res.data;
      } catch {
        setTasks((current) => current.filter((t) => t.id !== tempId));
        showToast('Не удалось создать задачу', 'error');
      }
    },
    updateTaskContent: async (id: string, title: string, description: string, priority: Priority) => {
      setTasks((current) => current.map((t) => (t.id === id ? { ...t, title, description, priority } : t)));
      try {
        await updateTask(id, { title, description, priority });
        showToast('Задача обновлена');
      } catch {
        showToast('Не удалось обновить задачу', 'error');
      }
    },
    deleteTask: async (id: string) => {
      setDeleteTargetId(id);
      setConfirmDeleteOpen(true);
    },
    confirmDelete: async () => {
      if (!deleteTargetId) return;
      setTasks((current) => current.filter((t) => t.id !== deleteTargetId));
      try {
        await deleteTask(deleteTargetId);
        showToast('Задача удалена');
      } catch {
        showToast('Не удалось удалить задачу', 'error');
      }
      setDeleteTargetId(null);
    },
    deleteSelected: () => {
      if (selected.length === 0) return;
      setConfirmDeleteSelectedOpen(true);
    },
    confirmDeleteSelected: async () => {
      if (selected.length === 0) return;
      const idsToDelete = [...selected];
      setTasks((current) => current.filter((t) => !idsToDelete.includes(t.id)));
      try {
        await Promise.all(idsToDelete.map((id) => deleteTask(id)));
        const count = idsToDelete.length;
        const message = count === 1
          ? 'Задача удалена'
          : `${pluralize(count, 'Задача удалена', 'Задачи удалены', 'Задач удалено')}`;
        showToast(message);
      } catch {
        showToast('Не удалось удалить задачи', 'error');
      } finally {
        setSelected([]);
      }
    },
    moveTask: async (id: string, newColumnName: string) => {
      setTasks((current) => current.map((t) => (t.id === id ? { ...t, column_name: newColumnName as any } : t)));
      try {
        await moveTask(id, newColumnName);
        showToast('Задача перемещена');
      } catch {
        showToast('Ошибка перемещения', 'error');
      }
    },
    moveSelected: async (ids: string[], targetColumn: string) => {
      setTasks((current) => current.map((t) => (ids.includes(t.id) ? { ...t, column_name: targetColumn as any } : t)));
      try {
        await Promise.all(ids.map((id) => moveTask(id, targetColumn)));
        const count = ids.length;
        const message = count === 1 
          ? 'Задача перемещена'
          : `${pluralize(count, 'Задача перемещена', 'Задачи перемещены', 'Задач перемещено')}`;
        showToast(message);
      } catch {
        showToast('Не удалось переместить задачи', 'error');
      } finally {
        setSelected([]);
      }
    },
  };

  const openModal = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    setEditingId(id);
    setEditingText(task.title);
    setEditingDesc(task.description || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setEditingText('');
    setEditingDesc('');
  };

  const toggleSelect = (id: string) =>
    setSelected((current) => (current.includes(id) ? current.filter((taskId) => taskId !== id) : [...current, id]));

  const selectAll = () => {
    if (selected.length === tasks.length) {
      setSelected([]);
    } else {
      setSelected(tasks.map((t) => t.id));
    }
  };

  const dragStartTask = (e: React.DragEvent, id: string) => {
    setDraggingTask(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const dropTask = (colKey: string) => {
    if (!draggingTask) return;
    const ids = selected.length && selected.includes(draggingTask) ? selected : [draggingTask];
    api.moveSelected(ids, colKey);
    setDraggingTask(null);
  };

  return {
    tasks,
    isLoading,
    api,
    modalOpen,
    openModal,
    closeModal,
    editingId,
    editingText,
    editingDesc,
    setEditingText,
    setEditingDesc,
    selected,
    toggleSelect,
    selectAll,
    draggingTask,
    dragStartTask,
    dropTask,
    confirmDeleteOpen,
    setConfirmDeleteOpen,
    confirmDeleteSelectedOpen,
    setConfirmDeleteSelectedOpen,
  };
};
