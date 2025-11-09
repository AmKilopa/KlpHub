import React, { useEffect, useRef, useState } from "react";

export default function KanbanTask({
  task,
  colKey,
  api,
  selected,
  toggleSelect,
  isLoading,
  // --- НОВОЕ: Получаем D&D пропсы ---
  draggingTask,
  dragStartTask,
}) {
  const [hoverTitle, setHoverTitle] = useState(false);
  const [hoverDesc, setHoverDesc] = useState(false);
  const [editMode, setEditMode] = useState(null); // "title" | "desc" | null
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.description || "");

  const titleRef = useRef(null);
  const descRef = useRef(null);

  useEffect(() => {
    setLocalTitle(task.title);
    setLocalDesc(task.description || "");
  }, [task.title, task.description]);

  useEffect(() => {
    if (editMode === "title" && titleRef.current) titleRef.current.focus();
    if (editMode === "desc" && descRef.current) descRef.current.focus();
  }, [editMode]);

  const startEditTitle = () => {
    if (isLoading) return;
    setHoverTitle(false);
    setEditMode("title");
  };
  const startEditDesc = () => {
    if (isLoading) return;
    setHoverDesc(false);
    setEditMode("desc");
  };

  const cancelEdit = () => {
    setLocalTitle(task.title);
    setLocalDesc(task.description || "");
    setEditMode(null);
    setHoverTitle(false);
    setHoverDesc(false);
  };

  const save = async () => {
    const title = localTitle.trim();
    if (!title) return cancelEdit();
    // Вызываем функцию из 'api' (теперь она доступна)
    await api.updateTaskContent(task.id, title, localDesc);
    setEditMode(null);
    setHoverTitle(false);
    setHoverDesc(false);
  };

  const onKeyDownTitle = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };
  const onKeyDownDesc = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      save();
    } else if (e.key === "Escape") {
      cancelEdit();
    }
  };

  // --- НОВОЕ: Определяем, эту ли задачу мы тащим ---
  const isDragging = draggingTask === task.id;

  return (
    <div
      draggable={!isLoading && !editMode}
      // --- НОВОЕ: Добавляем класс 'is-dragging' ---
      className={`kanban-task ${isLoading ? "loading" : ""} ${
        colKey === "done" ? "done" : ""
      } ${isDragging ? "is-dragging" : ""}`}
      onDragStart={e => !isLoading && !editMode && dragStartTask(e, task.id)}
    >
      <div className="kanban-task-header">
        <input
          type="checkbox"
          checked={selected.includes(task.id)}
          onChange={() => toggleSelect(task.id)}
          className="kanban-task-checkbox"
          disabled={isLoading}
        />
        <div className="kanban-task-content">
          {editMode === "title" ? (
            <input
              ref={titleRef}
              className="inline-input"
              value={localTitle}
              onChange={e => setLocalTitle(e.target.value)}
              onKeyDown={onKeyDownTitle}
              onBlur={save}
            />
          ) : (
            <span
              className={`task-title ${hoverTitle ? "is-hover" : ""}`}
              onMouseEnter={() => setHoverTitle(true)}
              onMouseLeave={() => setHoverTitle(false)}
              onDoubleClick={startEditTitle}
              title="Двойной клик — редактировать"
            >
              {task.title}
            </span>
          )}
          {editMode === "desc" ? (
            <textarea
              ref={descRef}
              className="inline-textarea"
              value={localDesc}
              onChange={e => setLocalDesc(e.target.value)}
              onKeyDown={onKeyDownDesc}
              onBlur={save}
              rows={3}
            />
          ) : (
            task.description && (
              <span
                className={`task-desc ${hoverDesc ? "is-hover" : ""}`}
                onMouseEnter={() => setHoverDesc(true)}
                onMouseLeave={() => setHoverDesc(false)}
                onDoubleClick={startEditDesc}
                title="Двойной клик — редактировать"
              >
                {task.description}
              </span>
            )
          )}
        </div>
        <button
          onClick={() => api.deleteTask(task.id)}
          className="delete-button"
          aria-label="Удалить"
        >
          ✕
        </button>
      </div>
    </div>
  );
}