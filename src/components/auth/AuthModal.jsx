import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export default function AuthModal({ title, onClose, children, className = '' }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return createPortal(
    <div className="auth-modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        aria-labelledby="auth-modal-title"
        aria-modal="true"
        className={`auth-modal ${className}`}
        role="dialog"
      >
        <button aria-label="Cerrar" className="auth-modal__close" onClick={onClose} type="button">
          <X size={20} aria-hidden="true" />
        </button>
        <span className="eyebrow">MediTurn</span>
        <h1 id="auth-modal-title">{title}</h1>
        {children}
      </section>
    </div>,
    document.body,
  );
}
