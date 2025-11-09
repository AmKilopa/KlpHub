import React, { useEffect, useRef, useState } from "react";
import '../../styles/KanbanTask.css';

function MiniLoader() {
  return (
    <span className="mini-loader"></span>
  );
}

export default function KanbanTask({
  task,
  colKey,
  api,
  selected,
  toggleSelect,
  isLoading,
  draggingTask,
  dragStartTask,
}) {
  const [hoverTitle, setHoverTitle] = useState(false);
  const [hoverDesc, setHoverDesc] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [localTitle, setLocalTitle] = useState(task.title);
  const [localDesc, setLocalDesc] = useState(task.description || "");
  const titleRef = useRef(null);
  const descRef = useRef(null);

  // Для анимации отдельного loader у нового таска
  const isTaskLoading = !!task.isLoading;

  useEffect(() => {
    setLocalTitle(task.title);
    setLocalDesc(task.description || "");
  }, [task.title, task.description]);

  useEffect(() => {
    if (editMode === "title" && titleRef.current) titleRef.current.focus();
    if (editMode === "desc" && descRef.current) descRef.current.focus();
  }, [editMode]);

  const startEditTitle = () => {
    if (isLoading || isTaskLoading) return;
    setHoverTitle(false);
    setEditMode("title");
  };
  const startEditDesc = () => {
    if (isLoading || isTaskLoading) return;
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

  const isDragging = draggingTask === task.id;

  return (
    <div
      draggable={!isLoading && !isTaskLoading && !editMode}
      className={`kanban-task${isDragging ? " is-dragging" : ""}${colKey === "done" ? " done" : ""}${(isLoading || isTaskLoading) ? " loading" : ""}`}
      onDragStart={e => !isLoading && !isTaskLoading && !editMode && dragStartTask(e, task.id)}
    >
      <input
        type="checkbox"
        checked={selected.includes(task.id)}
        onChange={() => toggleSelect(task.id)}
        className="kanban-task-checkbox"
        disabled={isLoading || isTaskLoading}
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
            disabled={isTaskLoading}
          />
        ) : (
          <span
            className={`task-title${hoverTitle ? " is-hover" : ""}`}
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
            disabled={isTaskLoading}
          />
        ) : (
          task.description && (
            <span
              className={`task-desc${hoverDesc ? " is-hover" : ""}`}
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
        disabled={isTaskLoading}
      >
        ✕
      </button>
      {isTaskLoading && <MiniLoader />}
    </div>
  );
}
