import React from 'react';

interface InputProps {
  label?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  name?: string;
  id?: string;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  disabled = false,
  placeholder,
  value,
  onChange,
  type = 'text',
  name,
  id,
  required = false,
}) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label
          htmlFor={inputId}
          style={{
            color: '#f1f5f9',
            fontSize: '14px',
            fontWeight: 500,
            letterSpacing: '0.025em',
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#e94560', marginLeft: '4px' }}>*</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        style={{
          backgroundColor: '#16213e',
          border: `1px solid ${error ? '#e94560' : '#2d3748'}`,
          borderRadius: '8px',
          color: '#f1f5f9',
          fontSize: '14px',
          padding: '10px 14px',
          outline: 'none',
          width: '100%',
          boxSizing: 'border-box',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          opacity: disabled ? 0.5 : 1,
          cursor: disabled ? 'not-allowed' : 'text',
        }}
        onFocus={(e) => {
          if (!disabled) {
            e.target.style.borderColor = error ? '#e94560' : '#6366f1';
            e.target.style.boxShadow = `0 0 0 3px ${error ? 'rgba(233,69,96,0.2)' : 'rgba(99,102,241,0.2)'}`;
          }
        }}
        onBlur={(e) => {
          e.target.style.borderColor = error ? '#e94560' : '#2d3748';
          e.target.style.boxShadow = 'none';
        }}
      />
      {error && (
        <span
          style={{
            color: '#e94560',
            fontSize: '12px',
            fontWeight: 400,
            marginTop: '2px',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
};
