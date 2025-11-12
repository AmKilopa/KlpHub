import React from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './Modal';
import Button from '@common/Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Удалить',
  cancelText = 'Отмена',
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <AlertTriangle size={32} color="var(--color-danger)" />
        <p style={{ margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>{message}</p>
      </div>
      <div className="modal-actions">
        <button onClick={onClose} className="btn-secondary">
          {cancelText}
        </button>
        <button onClick={handleConfirm} className="btn-danger">
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
