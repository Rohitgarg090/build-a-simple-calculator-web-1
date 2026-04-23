import React from 'react';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<string, string> = {
  success: 'background-color: #22c55e',
  warning: 'background-color: #f59e0b',
  error: 'background-color: #ef4444',
  info: 'background-color: #e94560',
  default: 'background-color: #16213e',
};

const variantClasses: Record<string, React.CSSProperties> = {
  success: { backgroundColor: '#22c55e', color: '#f1f5f9' },
  warning: { backgroundColor: '#f59e0b', color: '#1a1a2e' },
  error: { backgroundColor: '#ef4444', color: '#f1f5f9' },
  info: { backgroundColor: '#e94560', color: '#f1f5f9' },
  default: { backgroundColor: '#16213e', color: '#f1f5f9', border: '1px solid #2d3748' },
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  children,
  className = '',
}) => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px 10px',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    lineHeight: '1.25rem',
    letterSpacing: '0.025em',
    whiteSpace: 'nowrap',
    userSelect: 'none',
    transition: 'all 0.2s ease',
    ...variantClasses[variant],
  };

  return (
    <span
      style={baseStyle}
      className={className}
    >
      {children}
    </span>
  );
};
}