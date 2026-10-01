import { useEffect, useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { getWorkoutsByDateRange, getPRs } from '../services/workouts';
import type { Workout, PersonalRecord } from '../types';
import { subDays, format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';

export default function Progress() {
  const user = useStore((s) => s.user);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [prs, setPrs] = useState<PersonalRecord[]>([]);
  const [range, setRange] = useState(30);
  const [exercise, setExercise] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const start = subDays(new Date(), range).getTime();
      const [w, p] = await Promise.all([
        getWorkoutsByDateRange(user.uid, start, Date.now()),
        getPRs(user.uid),
      ]);
      setWorkouts(w);
      setPrs(p);
      setLoading(false);
    })();
  }, [user, range]);

  const exerciseNames = useMemo(() => {
    const set = new Set<string>();
    workouts.forEach((w) => w.exercises.forEach((e) => set.add(e.name)));
    return Array.from(set).sort();
  }, [workouts]);

  const volumeData = useMemo(() => {
    const map = new Map<string, number>();
    workouts.forEach((w) => {
      const key = format(w.startedAt, 'MMM d');
      map.set(key, (map.get(key) || 0) + w.totalVolume);
    });
    return Array.from(map.entries())
      .map(([date, volume]) => ({ date, volume: Math.round(volume) }))
      .reverse();
  }, [workouts]);

  const freqData = useMemo(() => {
    const map = new Map<string, number>();
    workouts.forEach((w) => {
      const key = format(w.startedAt, 'EEE');
      map.set(key, (map.get(key) || 0) + 1);
    });
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((d) => ({ day: d, count: map.get(d) || 0 }));
  }, [workouts]);

  const exerciseProgress = useMemo(() => {
    if (!exercise) return [];
    const points: { date: string; weight: number; reps: number }[] = [];
    [...workouts].reverse().forEach((w) => {
      const ex = w.exercises.find((e) => e.name === exercise);
      if (!ex) return;
      const best = ex.sets
        .filter((s) => !s.isWarmup && s.completed)
        .sort((a, b) => b.weight - a.weight || b.reps - a.reps)[0];
      if (best) {
        points.push({
          date: format(w.startedAt, 'MMM d'),
          weight: best.weight,
          reps: best.reps,
        });
      }
    });
    return points;
  }, [workouts, exercise]);

  if (loading) {
    return (
      <div className="page">
        <div className="state-box">
          <div className="spinner" />
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Progress</h1>

        <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setRange(d)}
              className={`btn btn-sm ${range === d ? 'btn-primary' : 'btn-secondary'}`}
            >
              {d}d
            </button>
          ))}
        </div>

        {/* Volume chart */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Training Volume</h2>
          {volumeData.length === 0 ? (
            <p className="text-secondary text-sm text-center py-6">No data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Bar dataKey="volume" fill="var(--accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Frequency */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Workout Frequency</h2>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={freqData}>
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
              <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Exercise progression */}
        <div className="card mb-4">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Exercise Progression</h2>
          <select
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
            style={{ marginBottom: 12 }}
          >
            <option value="">Select exercise</option>
            {exerciseNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          {exercise && exerciseProgress.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={exerciseProgress}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 13,
                  }}
                />
                <Line type="monotone" dataKey="weight" stroke="var(--accent)" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-secondary text-sm text-center py-4">
              {exercise ? 'No data for this exercise' : 'Select an exercise'}
            </p>
          )}
        </div>

        {/* Recent PRs */}
        <div className="card">
          <h2 style={{ fontSize: '0.9375rem', marginBottom: 12 }}>Personal Records</h2>
          {prs.length === 0 ? (
            <p className="text-secondary text-sm text-center py-4">No PRs yet — keep training!</p>
          ) : (
            <div className="flex flex-col gap-2">
              {prs.slice(0, 10).map((pr) => (
                <div
                  key={pr.id}
                  className="flex justify-between items-center"
                  style={{ padding: '0.5rem 0', borderBottom: '1px solid var(--border-subtle)' }}
                >
                  <div>
                    <div className="font-medium text-sm">{pr.exerciseName}</div>
                    <div className="text-xs text-muted">
                      {pr.type.replace('_', ' ')} · {format(pr.achievedAt, 'MMM d')}
                    </div>
                  </div>
                  <span className="badge badge-pr">
                    {pr.type === 'heaviest' || pr.type === 'estimated_1rm'
                      ? `${pr.value} kg`
                      : pr.type === 'most_reps'
                      ? `${pr.reps}× @ ${pr.weight}kg`
                      : `${Math.round(pr.value)} kg`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
