import React, { useEffect, useRef, useState } from "react";

// Мы получаем ...props из useKanban
export default function KanbanTask({
  task,
  colKey,
  dragStartTask,
  //
  // ИСПРАВЛЕНИЕ: Деструктурируем пропсы с ПРАВИЛЬНЫМИ именами из useKanban
  //
  api,           // Вместо 'askDelete' и 'updateTaskTitleDesc'
  selected,      // Вместо 'isTaskSelected'
  toggleSelect,  // Вместо 'toggleSelected'
  isLoading,     // Глобальный isLoading (вместо 'loadingIds')
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
    //
    // ИСПРАВЛЕНИЕ: Вызываем функцию из 'api'
    //
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

  return (
    <div
      draggable={!isLoading && !editMode}
      className={`kanban-task ${isLoading ? "loading" : ""} ${colKey === "done" ? "done" : ""}`}
      onDragStart={e => !isLoading && !editMode && dragStartTask && dragStartTask(e, task.id)}
    >
      <div className="kanban-task-header">
        <input
          type="checkbox"
          //
          // ИСПРАВЛЕНИЕ: Проверяем, включен ли id в МАССИВ 'selected'
          //
          checked={selected.includes(task.id)}
          //
          // ИСПРАВЛЕНИЕ: Используем ПРАВИЛЬНОЕ имя функции 'toggleSelect'
          //
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
              title="Двойной клик — редактировать, Enter/Blur — сохранить"
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
            // Отображаем описание, только если оно есть
            task.description && (
              <span
                className={`task-desc ${hoverDesc ? "is-hover" : ""}`}
                onMouseEnter={() => setHoverDesc(true)}
                onMouseLeave={() => setHoverDesc(false)}
                onDoubleClick={startEditDesc}
                title="Двойной клик — редактировать, Enter/Blur — сохранить"
              >
                {task.description}
              </span>
            )
          )}
        </div>
        <button
          //
          // ИСПРАВЛЕНИЕ: Вызываем функцию из 'api'
          //
          onClick={() => api.deleteTask(task.id)}
          className="delete-button"
          aria-label="Удалить"
        >
          ✕
        </button>
      </div>
      {/* Мы используем глобальный isLoading, так как per-task loading не реализован в хуке */}
      {isLoading && <span className="spinner" />}
    </div>
  );
}