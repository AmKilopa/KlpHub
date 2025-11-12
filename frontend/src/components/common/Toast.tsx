import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';
import '../../styles/components/Toast.css';

export interface ToastData {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning';
  count?: number;
  duration?: number;
  timestamp?: number; // Для перезапуска анимации
}

interface ToastProps {
  toast: ToastData;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [key, setKey] = useState(0);
  const duration = toast.duration || 3000;
  const prevTimestamp = useRef(toast.timestamp);

  useEffect(() => {
    // Перезапускаем анимацию при изменении timestamp
    if (toast.timestamp !== prevTimestamp.current) {
      setKey((prev) => prev + 1);
      prevTimestamp.current = toast.timestamp;
    }
  }, [toast.timestamp]);

  const icons = {
    success: <CheckCircle size={20} />,
    error: <XCircle size={20} />,
    warning: <AlertCircle size={20} />,
  };

  return (
    <div
      className={`toast toast-${toast.type}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="toast-icon">{icons[toast.type]}</div>
      <div className="toast-message">
        {toast.message}
        {toast.count && toast.count > 1 && <span className="toast-count"> ×{toast.count}</span>}
      </div>
      <button className="toast-close" onClick={() => onClose(toast.id)}>
        <X size={16} />
      </button>
      <div
        key={key}
        className={`toast-progress toast-progress-${toast.type} ${isPaused ? 'paused' : ''}`}
        style={{ animationDuration: `${duration}ms` }}
      />
    </div>
  );
};

export default Toast;
