import { useEffect, useState } from 'react';
import { useModals } from '../context/ModalContext';
import { useFocusTrap } from '../lib/useFocusTrap';
import { useReducedMotion } from '../lib/useReducedMotion';
import Slash from './Slash';
import './SlashPopup.css';

export default function SlashPopup({ message: propMessage, open: propOpen, onClose: propOnClose }) {
  const modals = useModals();
  const isControlled = typeof propOpen === 'boolean';
  const open = isControlled ? propOpen : modals.slashPopup.open;
  const message = isControlled ? propMessage : modals.slashPopup.message;
  const close = isControlled ? propOnClose : modals.closeSlashPopup;

  const reducedMotion = useReducedMotion();
  const trapRef = useFocusTrap(open, close);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!open || !message) return;
    if (reducedMotion) {
      setTyping(false);
      return;
    }
    setTyping(true);
    const timer = window.setTimeout(() => {
      setTyping(false);
    }, 680);
    return () => window.clearTimeout(timer);
  }, [open, message, reducedMotion]);

  if (!open) return null;

  return (
    <div
      className="slash-popup-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="slash-popup-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) close?.();
      }}
    >
      <div className="slash-popup-card glass" ref={trapRef}>
        <button
          type="button"
          className="slash-popup-close"
          onClick={close}
          aria-label="Close Slash message"
        >
          ×
        </button>

        <div className="slash-popup-body">
          <div className="slash-popup-avatar">
            <Slash size={72} />
          </div>

          <div className="slash-popup-content">
            <div className="slash-popup-meta" id="slash-popup-title">
              <span className="slash-popup-dot" aria-hidden="true" />
              <span>Slash · AI Success Manager</span>
            </div>

            <div className="slash-popup-msg" aria-live="polite">
              {typing ? (
                <span className="slash-typing" aria-label="Slash is typing">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                <p>{message}</p>
              )}
            </div>

            {!typing && (
              <div className="slash-popup-actions">
                <button type="button" className="btn btn-primary slash-ok-btn" onClick={close}>
                  Got it
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

