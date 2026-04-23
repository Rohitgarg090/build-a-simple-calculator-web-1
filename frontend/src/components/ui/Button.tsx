import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  children,
  className = '',
  type = 'button',
}) => {
  const baseStyles: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    borderRadius: '8px',
    fontWeight: 600,
    fontFamily: 'inherit',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    pointerEvents: loading ? 'none' : 'auto',
    transition: 'all 0.2s ease',
    border: '1px solid transparent',
    outline: 'none',
    position: 'relative',
    whiteSpace: 'nowrap',
    opacity: disabled ? 0.5 : 1,
    textDecoration: 'none',
  };

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: {
      padding: '6px 12px',
      fontSize: '13px',
      lineHeight: '1.4',
      minHeight: '32px',
    },
    md: {
      padding: '10px 20px',
      fontSize: '14px',
      lineHeight: '1.5',
      minHeight: '40px',
    },
    lg: {
      padding: '14px 28px',
      fontSize: '16px',
      lineHeight: '1.5',
      minHeight: '48px',
    },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: '#6366f1',
      color: '#ffffff',
      borderColor: '#6366f1',
    },
    secondary: {
      backgroundColor: '#16213e',
      color: '#f1f5f9',
      borderColor: '#2d3748',
    },
    ghost: {
      backgroundColor: 'transparent',
      color: '#f1f5f9',
      borderColor: 'transparent',
    },
    danger: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      borderColor: '#ef4444',
    },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...sizeStyles[size],
    ...variantStyles[variant],
  };

  const spinnerStyles: React.CSSProperties = {
    width: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '15px',
    height: size === 'sm' ? '12px' : size === 'lg' ? '18px' : '15px',
    border: '2px solid transparent',
    borderTopColor: variant === 'secondary' || variant === 'ghost' ? '#6366f1' : '#ffffff',
    borderRightColor: variant === 'secondary' || variant === 'ghost' ? '#6366f1' : '#ffffff',
    borderRadius: '50%',
    animation: 'button-spin 0.7s linear infinite',
    flexShrink: 0,
  };

  return (
    <>
      <style>{`
        @keyframes button-spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .speckai-btn-primary:hover:not(:disabled) {
          background-color: #4f51d8 !important;
          border-color: #4f51d8 !important;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.4);
        }
        .speckai-btn-secondary:hover:not(:disabled) {
          background-color: #1e2a4a !important;
          border-color: #4a5568 !important;
        }
        .speckai-btn-ghost:hover:not(:disabled) {
          background-color: rgba(99, 102, 241, 0.1) !important;
          border-color: #6366f1 !important;
        }
        .speckai-btn-danger:hover:not(:disabled) {
          background-color: #dc2626 !important;
          border-color: #dc2626 !important;
          box-shadow: 0 4px 15px rgba(239, 68, 68, 0.4);
        }
        .speckai-btn:active:not(:disabled) {
          transform: translateY(1px);
        }
        .speckai-btn:focus-visible {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.5);
        }
      `}</style>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled || loading}
        style={combinedStyles}
        className={`speckai-btn speckai-btn-${variant} ${className}`}
      >
        {loading && (
          <span style={spinnerStyles} aria-hidden="true" />
        )}
        {loading ? (
          <span style={{ opacity: 0.8 }}>
            {children}
          </span>
        ) : (
          <span>
            {children}
          </span>
        )}
      </button>
    </>
  );
};
