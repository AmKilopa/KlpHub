import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  className = '',
}) => {
  const buttonClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${buttonClass} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
