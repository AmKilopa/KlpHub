import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  moveTask
} from '../api';

export const useKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [massLoading, setMassLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const [selected, setSelected] = useState([]);
  const [draggingTask, setDraggingTask] = useState(null);

  // Для групповых уведомлений
  const toastStack = useRef({});

  function showToast(msg, type = "success") {
    if (!toastStack.current[msg]) toastStack.current[msg] = 1;
    else toastStack.current[msg]++;
    const count = toastStack.current[msg];
    let text = msg + (count > 1 ? ` x${count}` : "");
    toast[type](text, {
      theme: "dark",
      toastId: msg,
      onClose: () => { toastStack.current[msg] = 0; }
    });
  }

  useEffect(() => { fetchTasks(); }, []);
  const fetchTasks = () => {
    setIsLoading(true);
    getTasks()
      .then(res => setTasks(res.data))
      .catch(() => showToast('Ошибка загрузки задач', 'error'))
      .finally(() => setIsLoading(false));
  };

  // msg-селекторы для количества задач
  function getDeletedMsg(count) {
    return count === 1 ? 'Задача удалена' : 'Задачи удалены';
  }
  function getMovedMsg(count) {
    return count === 1 ? 'Задача перемещена' : 'Задачи перемещены';
  }

  const api = {
    addTask: async (title, desc = "", column = 'planned') => {
      const tempId = Math.random().toString(36);
      setTasks(current => [...current, {
        id: tempId, title, description: desc, columnname: column, isLoading: true
      }]);
      try {
        const res = await createTask(title, column, desc);
        setTasks(current => [...current.filter(t => t.id !== tempId), res.data]);
        showToast('Задача создана', 'success');
        return res.data;
      } catch {
        setTasks(current => current.filter(t => t.id !== tempId));
        showToast('Не удалось создать задачу', 'error');
      }
    },
    updateTaskContent: async (id, title, description) => {
      setTasks(current => current.map(t => t.id === id ? { ...t, title, description } : t));
      try {
        await updateTask(id, { title, description });
        showToast('Задача обновлена', 'success');
      } catch {
        showToast('Не удалось обновить задачу', 'error');
      }
    },
    deleteTask: async (id) => {
      setTasks(current => current.filter(t => t.id !== id));
      try {
        await deleteTask(id);
        showToast(getDeletedMsg(1), 'success');
      } catch {
        showToast('Не удалось удалить задачу', 'error');
      }
    },
    moveTask: async (id, newColumnName) => {
      setTasks(current => current.map(t => t.id === id ? { ...t, columnname: newColumnName } : t));
      try {
        await moveTask(id, newColumnName);
        showToast(getMovedMsg(1), 'success');
      } catch {
        showToast('Ошибка перемещения', 'error');
      }
    },
    moveSelected: async (ids, targetColumn) => {
      setMassLoading(true);
      setTasks(current =>
        current.map(t => ids.includes(t.id) ? { ...t, columnname: targetColumn } : t)
      );
      try {
        await Promise.all(ids.map(id => moveTask(id, targetColumn)));
        showToast(getMovedMsg(ids.length), 'success');
      } catch {
        showToast('Не удалось переместить задачи', 'error');
      } finally {
        setMassLoading(false);
        setSelected([]);
      }
    }
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
  const toggleSelect = (id) => setSelected(current =>
    current.includes(id) ? current.filter(taskId => taskId !== id) : [...current, id]
  );
  const selectAll = (tasksToSelect) => {
    const allIds = tasksToSelect.map(t => t.id);
    setSelected(selected.length === allIds.length ? [] : allIds);
  };
  const removeSelected = () => {
    setMassLoading(true);
    Promise.all(selected.map(id => api.deleteTask(id)))
      .then(() => showToast(getDeletedMsg(selected.length), 'success'))
      .finally(() => {
        setMassLoading(false);
        setSelected([]);
      });
  };
  const dragStartTask = (e, id) => {
    setDraggingTask(id);
    e.dataTransfer.effectAllowed = 'move';
  };
  const dropTask = (colKey) => {
    const ids = selected.length && selected.includes(draggingTask)
      ? selected
      : [draggingTask];
    api.moveSelected(ids, colKey);
    setDraggingTask(null);
  };

  return {
    tasks,
    isLoading,
    massLoading,
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
