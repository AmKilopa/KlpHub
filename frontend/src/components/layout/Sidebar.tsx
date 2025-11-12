import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import PrioritySelector from '../common/PrioritySelector';
import { Priority } from '../../types';
import '../../styles/components/Sidebar.css';

interface SidebarProps {
  onAddTask: (title: string, description?: string, column?: string, priority?: Priority) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAddTask(title, description, 'planned', priority);
    setTitle('');
    setDescription('');
    setPriority('medium');
  };

  return (
    <div className="sidebar">
      <h2 className="sidebar-title">Новая задача</h2>
      <form onSubmit={handleSubmit} className="sidebar-form">
        <input
          type="text"
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="sidebar-input"
          maxLength={100}
        />
        <textarea
          placeholder="Описание (необязательно)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="sidebar-textarea"
          maxLength={500}
        />
        <PrioritySelector value={priority} onChange={setPriority} />
        <button type="submit" className="sidebar-button">
          <Plus size={18} />
          <span>Добавить задачу</span>
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
