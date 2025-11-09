import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask
} from '../../api';

export const COLUMNS = {
  todo: 'To Do',
  inprogress: 'In Progress',
  done: 'Done',
};

export const useKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [selected, setSelected] = useState([]);
  const [draggingTask, setDraggingTask] = useState(null);

  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(err => toast.error('Не удалось загрузить задачи'))
      .finally(() => setIsLoading(false));
  }, []);

  const api = {
    addTask: async (title, desc = "", column = 'todo') => {
      try {
        const res = await createTask(title, column, desc);
        setTasks(current => [...current, res.data]);
        toast.success('Задача создана');
        return res.data;
      } catch (err) {
        toast.error('Не удалось создать задачу');
      }
    },
    updateTaskContent: async (id, title, description) => {
      const oldTasks = tasks;
      setTasks(current =>
        current.map(t =>
          t.id === id ? { ...t, title, description } : t
        )
      );
      try {
        await updateTask(id, { title, description });
        toast.success('Задача обновлена');
      } catch (err) {
        setTasks(oldTasks);
        toast.error('Не удалось обновить задачу');
      }
    },
    deleteTask: async (id) => {
      const oldTasks = tasks;
      setTasks(current => current.filter(t => t.id !== id));
      try {
        await deleteTask(id);
        toast.success('Задача удалена');
      } catch (err) {
        setTasks(oldTasks);
        toast.error('Не удалось удалить задачу');
      }
    },
    moveTask: async (id, newColumnName) => {
      const oldTasks = tasks;
      setTasks(current =>
        current.map(t => (t.id === id ? { ...t, columnname: newColumnName } : t))
      );
      try {
        await moveTask(id, newColumnName);
      } catch (err) {
        setTasks(oldTasks);
        toast.error('Не удалось переместить задачу');
      }
    },
  };

  const openModal = (id) => {
    const task = tasks.find(t => t.id === id);
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

  const saveEditDesc = () => {
    if (!editingId) return;
    api.updateTaskContent(editingId, editingText, editingDesc);
    closeModal();
  };

  const toggleSelect = (id) => {
    setSelected(current =>
      current.includes(id) ? current.filter(taskId => taskId !== id) : [...current, id]
    );
  };

  const selectAll = (tasksToSelect) => {
    const allIds = tasksToSelect.map(t => t.id);
    if (selected.length === allIds.length) {
      setSelected([]);
    } else {
      setSelected(allIds);
    }
  };

  const removeSelected = () => {
    const oldTasks = tasks;
    setTasks(current => current.filter(t => !selected.includes(t.id)));
    const promises = selected.map(id => api.deleteTask(id));
    Promise.all(promises)
      .then(() => {
        toast.success(`Удалено ${selected.length} задач`);
        setSelected([]);
      })
      .catch(() => {
        setTasks(oldTasks);
        toast.error('Не удалось удалить выбранные задачи');
      });
  };

  const dragStartTask = (e, id) => {
    setDraggingTask(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const dropTask = (colKey) => {
    const task = tasks.find(t => t.id === draggingTask);
    if (draggingTask && task && task.columnname !== colKey) {
      api.moveTask(draggingTask, colKey);
    }
    setDraggingTask(null);
  };

  return {
    tasks,
    columns: COLUMNS,
    isLoading,
    api,
    modalOpen,
    openModal,
    closeModal,
    saveEditDesc,
    editingId,
    editingText,
    editingDesc,
    setEditingText,
    setEditingDesc,
    selected,
    toggleSelect,
    selectAll,
    removeSelected,
    draggingTask,
    dragStartTask,
    dropTask,
  };
};
