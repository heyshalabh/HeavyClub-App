import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { getWorkout, deleteWorkout } from '../services/workouts';
import type { Workout } from '../types';
import { formatDate, formatDuration, formatTime } from '../utils/helpers';

export default function WorkoutDetail() {
  const { id } = useParams<{ id: string }>();
  const user = useStore((s) => s.user);
  const addToast = useStore((s) => s.addToast);
  const navigate = useNavigate();
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    getWorkout(user.uid, id)
      .then(setWorkout)
      .finally(() => setLoading(false));
  }, [user, id]);

  const handleDelete = async () => {
    if (!user || !id || !confirm('Delete this workout?')) return;
    await deleteWorkout(user.uid, id);
    addToast('Workout deleted', 'info');
    navigate('/history');
  };

  if (loading) {
    return (
      <div className="page">
        <div className="state-box">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  if (!workout) {
    return (
      <div className="page">
        <div className="state-box">
          <p>Workout not found</p>
          <Link to="/history" className="btn btn-secondary btn-sm mt-2">
            Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <Link to="/history" className="btn btn-ghost btn-sm">
            <ArrowLeft size={18} /> Back
          </Link>
          <button onClick={handleDelete} className="btn btn-ghost btn-sm" style={{ color: 'var(--danger)' }}>
            <Trash2 size={16} />
          </button>
        </div>

        <h1 style={{ fontSize: '1.5rem' }}>{workout.name}</h1>
        <p className="text-secondary text-sm mt-1 mb-4">
          {formatDate(workout.finishedAt || workout.startedAt)} · {formatTime(workout.startedAt)}
          {workout.duration ? ` · ${formatDuration(workout.duration)}` : ''}
        </p>

        <div className="card card-sm mb-4 flex justify-between">
          <div>
            <div className="text-xs text-muted">Volume</div>
            <div className="font-bold">{Math.round(workout.totalVolume).toLocaleString()} kg</div>
          </div>
          <div>
            <div className="text-xs text-muted">Exercises</div>
            <div className="font-bold">{workout.exercises.length}</div>
          </div>
          <div>
            <div className="text-xs text-muted">Sets</div>
            <div className="font-bold">
              {workout.exercises.reduce((s, e) => s + e.sets.filter((x) => x.completed).length, 0)}
            </div>
          </div>
        </div>

        {workout.exercises.map((ex) => (
          <div key={ex.id} className="card mb-3">
            <h3 style={{ fontSize: '1rem', marginBottom: 8 }}>{ex.name}</h3>
            <div className="text-xs text-muted mb-1" style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 1fr', gap: 8 }}>
              <span>Set</span>
              <span>kg</span>
              <span>Reps</span>
              <span></span>
            </div>
            {ex.sets.map((s, i) => (
              <div
                key={s.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '40px 1fr 1fr 1fr',
                  gap: 8,
                  fontSize: '0.875rem',
                  padding: '4px 0',
                  opacity: s.completed ? 1 : 0.5,
                }}
              >
                <span className="text-muted">{s.isWarmup ? 'W' : i + 1}</span>
                <span>{s.weight}</span>
                <span>{s.reps}</span>
                <span className="text-muted text-xs">{s.completed ? '✓' : ''}</span>
              </div>
            ))}
          </div>
        ))}

        {workout.notes && (
          <div className="card card-sm">
            <div className="text-xs text-muted mb-1">Notes</div>
            <p className="text-sm">{workout.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
