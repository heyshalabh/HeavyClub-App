import { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Goal } from '../types';
import { generateId } from '../utils/helpers';
import { Plus, Target, Check } from 'lucide-react';

export default function Goals() {
  const user = useStore((s) => s.user);
  const addToast = useStore((s) => s.addToast);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [target, setTarget] = useState(12);
  const [type, setType] = useState<Goal['type']>('workouts_month');

  const load = async () => {
    if (!user) return;
    setLoading(true);
    const snap = await getDocs(
      query(collection(db, 'users', user.uid, 'goals'), orderBy('createdAt', 'desc'))
    );
    setGoals(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Goal)));
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, [user]);

  const createGoal = async () => {
    if (!user || !title.trim()) return;
    const g: Goal = {
      id: generateId(),
      userId: user.uid,
      type,
      title: title.trim(),
      target,
      current: 0,
      startDate: Date.now(),
      completed: false,
      createdAt: Date.now(),
    };
    await addDoc(collection(db, 'users', user.uid, 'goals'), g);
    addToast('Goal created', 'success');
    setShowForm(false);
    setTitle('');
    load();
  };

  const toggleComplete = async (g: Goal) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'goals', g.id), {
      completed: !g.completed,
      current: !g.completed ? g.target : g.current,
    });
    load();
  };

  const achievements = [
    { title: 'First Workout', unlocked: (user?.totalWorkouts || 0) >= 1 },
    { title: '10 Workouts', unlocked: (user?.totalWorkouts || 0) >= 10 },
    { title: '25 Workouts', unlocked: (user?.totalWorkouts || 0) >= 25 },
    { title: '50 Workouts', unlocked: (user?.totalWorkouts || 0) >= 50 },
    { title: '100 Workouts', unlocked: (user?.totalWorkouts || 0) >= 100 },
    { title: '7-Day Streak', unlocked: (user?.currentStreak || 0) >= 7 || (user?.longestStreak || 0) >= 7 },
    { title: '30-Day Consistency', unlocked: (user?.longestStreak || 0) >= 30 },
    { title: 'First PR', unlocked: (user?.prCount || 0) >= 1 },
  ];

  return (
    <div className="page fade-in">
      <div className="container">
        <div className="flex justify-between items-center mb-4">
          <h1 style={{ fontSize: '1.5rem' }}>Goals</h1>
          <button onClick={() => setShowForm(true)} className="btn btn-primary btn-sm">
            <Plus size={16} /> New
          </button>
        </div>

        {showForm && (
          <div className="card mb-4">
            <div className="form-group">
              <label className="form-label">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. 12 workouts this month" />
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value as Goal['type'])}>
                <option value="workouts_month">Workouts this month</option>
                <option value="workouts_week">Workouts this week</option>
                <option value="streak">Maintain streak</option>
                <option value="custom">Custom</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Target</label>
              <input type="number" value={target} onChange={(e) => setTarget(parseInt(e.target.value) || 1)} min={1} />
            </div>
            <div className="flex gap-2">
              <button onClick={createGoal} className="btn btn-primary btn-sm">
                Create
              </button>
              <button onClick={() => setShowForm(false)} className="btn btn-ghost btn-sm">
                Cancel
              </button>
            </div>
          </div>
        )}

        {loading ? (
          <div className="state-box">
            <div className="spinner" />
          </div>
        ) : goals.length === 0 ? (
          <div className="state-box">
            <Target size={32} />
            <p>No goals yet</p>
            <p className="text-sm text-muted">Set a target to stay consistent</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 mb-6">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.current / g.target) * 100));
              return (
                <div key={g.id} className="card card-sm">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-medium text-sm">{g.title}</div>
                      <div className="text-xs text-muted">
                        {g.current}/{g.target}
                      </div>
                    </div>
                    <button
                      onClick={() => toggleComplete(g)}
                      className="btn-icon"
                      style={{
                        background: g.completed ? 'var(--accent)' : 'var(--bg-hover)',
                        color: g.completed ? '#fff' : 'var(--text-muted)',
                        borderRadius: 8,
                      }}
                    >
                      <Check size={16} />
                    </button>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <h2 style={{ fontSize: '1.125rem', marginBottom: 12 }}>Achievements</h2>
        <div className="grid-2">
          {achievements.map((a) => (
            <div
              key={a.title}
              className="card card-sm"
              style={{
                opacity: a.unlocked ? 1 : 0.45,
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 24, marginBottom: 4 }}>{a.unlocked ? '🏅' : '🔒'}</div>
              <div className="text-sm font-medium">{a.title}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
