import React, { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 2500 }) {
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onClose]);

  if (!message) return null;

  return (
    <div
      className={`toast toast-${type}`}
      role="status"
      aria-live="polite"
    >
      <div className="toastText">{message}</div>
      <button className="toastClose" type="button" onClick={() => onClose?.()} aria-label="Close">
        ×
      </button>
    </div>
  );
}

