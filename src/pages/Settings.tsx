import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logOut } from '../services/auth';
import { useStore } from '../store/useStore';
import type { Theme } from '../types';
import { Moon, Sun, Monitor, LogOut, Download, Trash2 } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

export default function Settings() {
  const { user, theme, setTheme, settings, setSettings, addToast } = useStore();
  const navigate = useNavigate();
  const [exporting, setExporting] = useState(false);

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const snap = await getDocs(collection(db, 'users', user.uid, 'workouts'));
      const data = snap.docs.map((d) => d.data());
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `heavyclub-workouts-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      addToast('Export downloaded', 'success');
    } catch {
      addToast('Export failed', 'error');
    } finally {
      setExporting(false);
    }
  };

  const themes: { value: Theme; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: 'Light' },
    { value: 'dark', icon: Moon, label: 'Dark' },
    { value: 'system', icon: Monitor, label: 'System' },
  ];

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Settings</h1>

        {/* Theme */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Appearance</h2>
          <div className="flex gap-2">
            {themes.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => {
                  setTheme(value);
                  setSettings({ theme: value });
                }}
                className={`btn btn-sm ${theme === value ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Units */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Units</h2>
          <div className="flex gap-2">
            {(['kg', 'lbs'] as const).map((u) => (
              <button
                key={u}
                onClick={() => setSettings({ units: u })}
                className={`btn btn-sm ${settings.units === u ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flex: 1 }}
              >
                {u.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Rest timer default */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Default Rest Timer</h2>
          <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
            {[60, 90, 120, 180, 240].map((s) => (
              <button
                key={s}
                onClick={() => setSettings({ restTimerDefault: s })}
                className={`btn btn-sm ${settings.restTimerDefault === s ? 'btn-primary' : 'btn-secondary'}`}
              >
                {s >= 60 ? `${s / 60}m` : `${s}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Notifications</h2>
          {(
            Object.entries(settings.notifications) as [keyof typeof settings.notifications, boolean][]
          ).map(([key, val]) => (
            <label
              key={key}
              className="flex justify-between items-center"
              style={{ padding: '0.5rem 0', cursor: 'pointer' }}
            >
              <span className="text-sm" style={{ textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <input
                type="checkbox"
                checked={val}
                onChange={(e) =>
                  setSettings({
                    notifications: { ...settings.notifications, [key]: e.target.checked },
                  })
                }
                style={{ width: 18, height: 18, accentColor: 'var(--accent)' }}
              />
            </label>
          ))}
        </div>

        {/* Data */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Data</h2>
          <button onClick={handleExport} className="btn btn-secondary btn-block mb-2" disabled={exporting}>
            <Download size={16} />
            {exporting ? 'Exporting…' : 'Export Workouts (JSON)'}
          </button>
          <p className="text-xs text-muted">
            Account deletion: contact support or use Firebase console. Profile images and private data will be removed.
          </p>
        </div>

        {/* Account */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 8 }}>Account</h2>
          <p className="text-sm text-secondary mb-3">{user?.email}</p>
          <button onClick={handleLogout} className="btn btn-secondary btn-block">
            <LogOut size={16} /> Log out
          </button>
        </div>

        <p className="text-center text-xs text-muted mt-6">
          HeavyClub v1.0 · © 2026 · Built by Shalabh Suman
        </p>
      </div>
    </div>
  );
}
