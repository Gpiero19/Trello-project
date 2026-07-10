import { useEffect } from "react";

/**
 * Shared modal shell: backdrop, Escape-to-close, click-outside-to-close.
 * Uses the .modal-backdrop / .modal classes defined in index.css.
 */
function Modal({ onClose, children, className = "" }) {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={`modal ${className}`.trim()}>{children}</div>
    </div>
  );
}

export default Modal;
