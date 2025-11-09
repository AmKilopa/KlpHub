import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
// Импортируем из нашего нового, чистого API
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

// Мы используем named export
export const useKanban = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- State для модального окна ---
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDesc, setEditingDesc] = useState('');

  // --- State для выделения ---
  const [selected, setSelected] = useState([]);

  // Загрузка задач при старте
  useEffect(() => {
    getTasks()
      .then(res => setTasks(res.data))
      .catch(err => {
        console.error(err);
        toast.error('Не удалось загрузить задачи');
      })
      .finally(() => setIsLoading(false));
  }, []);

  // --- API функции (которые мы передадим в компоненты) ---
  const api = {
    addTask: async (title, column = 'todo') => {
      try {
        const newTask = await createTask(title);
        setTasks(current => [...current, newTask.data]);
        toast.success('Задача создана');
        return newTask.data;
      } catch (err) {
        console.error(err);
        toast.error('Не удалось создать задачу');
      }
    },

    updateTaskContent: async (id, title, description) => {
      const oldTasks = tasks;
      // Оптимистичное обновление
      setTasks(current =>
        current.map(t =>
          t.id === id ? { ...t, title, description } : t
        )
      );
      try {
        await updateTask(id, { title, description });
        toast.success('Задача обновлена');
      } catch (err) {
        console.error(err);
        setTasks(oldTasks); // Откат в случае ошибки
        toast.error('Не удалось обновить задачу');
      }
    },

    deleteTask: async (id) => {
      const oldTasks = tasks;
      // Оптимистичное удаление
      setTasks(current => current.filter(t => t.id !== id));
      try {
        await deleteTask(id);
        toast.success('Задача удалена');
      } catch (err) {
        console.error(err);
        setTasks(oldTasks); // Откат
        toast.error('Не удалось удалить задачу');
      }
    },

    moveTask: async (id, newColumnName) => {
      const oldTasks = tasks;
      // Оптимистичное перемещение
      setTasks(current =>
        current.map(t => (t.id === id ? { ...t, columnname: newColumnName } : t))
      );
      try {
        // moveTask - это псевдоним для updateTask в api/index.js
        await moveTask(id, newColumnName);
      } catch (err) {
        console.error(err);
        setTasks(oldTasks); // Откат
        toast.error('Не удалось переместить задачу');
      }
    },
  };

  // --- Логика модального окна ---
  const openModal = (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    setEditingId(id);
    setEditingText(task.title);
    setEditingDesc(task.description);
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

  // --- Логика выделения ---
  const toggleSelect = (id) => {
    setSelected(current =>
      current.includes(id) ? current.filter(taskId => taskId !== id) : [...current, id]
    );
  };

  const selectAll = (tasksToSelect) => {
    const allIds = tasksToSelect.map(t => t.id);
    if (selected.length === allIds.length) {
      setSelected([]); // Сбросить, если уже выделены
    } else {
      setSelected(allIds);
    }
  };

  const removeSelected = () => {
    const oldTasks = tasks;
    
    // Оптимистично удаляем
    setTasks(current => current.filter(t => !selected.includes(t.id)));
    const promises = selected.map(id => deleteTask(id));
    
    Promise.all(promises)
      .then(() => {
        toast.success(`Удалено ${selected.length} задач`);
        setSelected([]); // Очищаем выделение
      })
      .catch((err) => {
        console.error(err);
        setTasks(oldTasks); // Откат в случае ошибки
        toast.error('Не удалось удалить выбранные задачи');
      });
  };

  // Возвращаем ВСЕ, что нужно компонентам
  return {
    tasks,
    columns: COLUMNS,
    isLoading,
    api, // `api` содержит addTask, deleteTask, moveTask
    
    // Логика модалки
    modalOpen,
    openModal,
    closeModal,
    saveEditDesc,
    editingId,
    editingText,
    editingDesc,
    setEditingText,
    setEditingDesc,

    // Логика выделения
    selected,
    toggleSelect,
    selectAll,
    removeSelected,
  };
};