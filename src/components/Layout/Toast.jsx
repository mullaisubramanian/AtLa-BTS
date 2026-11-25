import { useModals } from '../../context/ModalContext';
import './Toast.css';

export default function Toast() {
  const { toastMsg, toastVisible } = useModals();

  return (
    <div
      className={`toast ${toastVisible ? 'show' : ''}`}
      role="status"
      aria-live="polite"
    >
      {toastMsg}
    </div>
  );
}

