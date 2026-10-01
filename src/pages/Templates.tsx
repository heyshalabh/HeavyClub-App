import { Link } from 'react-router-dom';
import { STARTER_TEMPLATES } from '../lib/exerciseLibrary';
import { Play } from 'lucide-react';

export default function Templates() {
  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Templates</h1>
        <p className="text-secondary text-sm mb-4">
          Start from a template or create your own while logging.
        </p>

        <div className="flex flex-col gap-3">
          {STARTER_TEMPLATES.map((t) => (
            <div key={t.name} className="card">
              <div className="flex justify-between items-start mb-2">
                <h2 style={{ fontSize: '1.0625rem' }}>{t.name}</h2>
                <Link
                  to={`/workout?template=${encodeURIComponent(t.name)}`}
                  className="btn btn-primary btn-sm"
                >
                  <Play size={14} /> Start
                </Link>
              </div>
              <div className="text-xs text-muted">
                {t.exercises.map((e) => e.name).join(' · ')}
              </div>
              <div className="text-xs text-secondary mt-1">
                {t.exercises.length} exercises
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
