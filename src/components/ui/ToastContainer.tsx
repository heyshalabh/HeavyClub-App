import { useStore } from '../../store/useStore';

export default function ToastContainer() {
  const { toasts, removeToast } = useStore();
  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast toast-${t.type}`}
          onClick={() => removeToast(t.id)}
          role="alert"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}
