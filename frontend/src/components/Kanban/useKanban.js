import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getTodos, createTodo, deleteTodo,
  moveTodo, editTodo as apiEditTodo
} from "../../api/kanbanApi";

export default function useKanban() {
  const [todos, setTodos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadingIds, setLoadingIds] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => { fetchTodos(); }, []);

  const fetchTodos = async () => {
    try {
      const res = await getTodos();
      setTodos(res.data || []);
    } catch {
      toast.error("Ошибка загрузки задач");
    }
  };

  const addTask = async (title, description) => {
    if (!title.trim()) return toast.error("Название пустое");
    if (title.length > 128) return toast.error("Название слишком длинное");
    if (description.length > 1024) return toast.error("Описание слишком длинное");
    const tempId = "temp_" + Date.now();
    setTodos([{ id: tempId, title, description, columnname: "todo" }, ...todos]);
    setLoadingIds(ids => [...ids, tempId]);
    try {
      await createTodo(title, description);
      await fetchTodos();
      toast.success("Задача добавлена");
    } catch {
      toast.error("Не удалось создать задачу");
    } finally {
      setLoadingIds(ids => ids.filter(x => x !== tempId));
    }
  };

  const askDelete = async (id) => {
    const prev = todos;
    setTodos(todos.filter(t => t.id !== id));
    try {
      await deleteTodo(id);
      await fetchTodos();
      toast.success("Задача удалена");
    } catch {
      setTodos(prev);
      toast.error("Ошибка удаления");
    }
  };

  const removeSelected = async () => {
    if (!selected.length) return;
    setIsLoading(true);
    const prev = todos;
    try {
      await Promise.all(selected.map(id => deleteTodo(id)));
      await fetchTodos();
      setSelected([]);
      toast.success("Выбранные удалены");
    } catch {
      setTodos(prev);
      toast.error("Ошибка массового удаления");
    } finally {
      setIsLoading(false);
    }
  };

  const moveTask = async (id, columnName) => {
    const idsToMove = selected.length && selected.includes(id)
      ? selected.filter(selId => {
          const t = todos.find(x => x.id === selId);
          return !loadingIds.includes(selId) && t?.columnname !== columnName;
        })
      : !loadingIds.includes(id) ? [id] : [];

    if (!idsToMove.length) return;
    setTodos(ts => ts.map(t => idsToMove.includes(t.id) ? { ...t, columnname: columnName } : t));
    try {
      await Promise.all(idsToMove.map(mid => moveTodo(mid, columnName)));
      await fetchTodos();
    } catch {
      toast.error("Ошибка перемещения");
      await fetchTodos();
    }
    setSelected([]);
  };

  const updateTaskTitleDesc = async (id, title, description) => {
    const prev = todos;
    setTodos(ts => ts.map(t => t.id === id ? { ...t, title, description } : t));
    try {
      await apiEditTodo(id, title, description);
    } catch {
      setTodos(prev);
      toast.error("Ошибка сохранения");
    }
  };

  const toggleSelected = (id) =>
    setSelected(sel => sel.includes(id) ? sel.filter(x => x !== id) : [...sel, id]);
  const selectAll = (filtered) =>
    setSelected(filtered.every(t => selected.includes(t.id)) ? [] : filtered.map(t => t.id));
  const isTaskSelected = (id) => selected.includes(id);
  const dragOverColumn = e => e.preventDefault();
  const dragStartTask = (e, id) => setDraggedTaskId(id);
  const dropOnColumn = (e, colKey) => {
    e.preventDefault();
    if (draggedTaskId) {
      moveTask(draggedTaskId, colKey);
      setDraggedTaskId(null);
    }
  };

  return {
    todos, selected, loadingIds, isTaskSelected, selectAll, toggleSelected,
    addTask, moveTask, removeSelected, askDelete,
    dragStartTask, dragOverColumn, dropOnColumn,
    updateTaskTitleDesc, isLoading,
  };
}
