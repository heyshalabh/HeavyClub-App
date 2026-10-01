import { WifiOff } from 'lucide-react';
import { useStore } from '../../store/useStore';

export default function OfflineBanner() {
  const isOnline = useStore((s) => s.isOnline);
  if (isOnline) return null;

  return (
    <div
      style={{
        background: 'var(--warning)',
        color: '#000',
        textAlign: 'center',
        padding: '0.5rem',
        fontSize: '0.8125rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        zIndex: 200,
      }}
    >
      <WifiOff size={14} />
      You&apos;re offline — changes will sync when back online
    </div>
  );
}
