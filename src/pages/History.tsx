import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getWorkouts } from '../services/workouts';
import type { Workout } from '../types';
import { formatDate, formatDuration } from '../utils/helpers';
import type { QueryDocumentSnapshot } from 'firebase/firestore';

export default function History() {
  const user = useStore((s) => s.user);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const load = async (reset = false) => {
    if (!user) return;
    setLoading(true);
    try {
      const { workouts: data, last } = await getWorkouts(user.uid, 20, reset ? undefined : lastDoc || undefined);
      setWorkouts((prev) => (reset ? data : [...prev, ...data]));
      setLastDoc(last);
      setHasMore(data.length === 20);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(true);
  }, [user]);

  const filtered = workouts.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      w.name.toLowerCase().includes(q) ||
      w.exercises.some((e) => e.name.toLowerCase().includes(q))
    );
  });

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>History</h1>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or exercise"
            style={{ paddingLeft: 36 }}
          />
        </div>

        {loading && workouts.length === 0 ? (
          <div className="state-box">
            <div className="spinner" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="state-box">
            <p>No workouts found</p>
            <Link to="/workout" className="btn btn-primary btn-sm mt-2">
              Start one
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((w) => (
              <Link
                key={w.id}
                to={`/workout/${w.id}`}
                className="card card-sm flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{w.name || 'Workout'}</div>
                  <div className="text-muted text-xs">
                    {formatDate(w.finishedAt || w.startedAt)}
                    {w.duration ? ` · ${formatDuration(w.duration)}` : ''}
                    {` · ${w.exercises.length} exercises`}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-secondary">
                    {Math.round(w.totalVolume).toLocaleString()} kg
                  </span>
                  <ChevronRight size={16} className="text-muted" />
                </div>
              </Link>
            ))}
            {hasMore && !search && (
              <button onClick={() => load(false)} className="btn btn-secondary btn-block mt-2" disabled={loading}>
                {loading ? 'Loading…' : 'Load more'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
