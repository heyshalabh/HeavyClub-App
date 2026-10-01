import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Check,
  X,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Copy,
  ChevronUp,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { saveWorkout, detectPRs, savePRs, getPRs, getRecentWorkouts } from '../services/workouts';
import { STARTER_EXERCISES } from '../lib/exerciseLibrary';
import type { Workout, WorkoutExercise, WorkoutSet } from '../types';
import { generateId, calcVolume, formatDuration } from '../utils/helpers';

function createEmptySet(isWarmup = false): WorkoutSet {
  return {
    id: generateId(),
    reps: 0,
    weight: 0,
    isWarmup,
    completed: false,
  };
}

function createExercise(name: string, order: number): WorkoutExercise {
  return {
    id: generateId(),
    name,
    sets: [createEmptySet()],
    order,
  };
}

export default function WorkoutLogger() {
  const { user, settings, activeWorkout, setActiveWorkout, saveDraft, draftWorkout, clearActiveWorkout, addToast } =
    useStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const templateName = searchParams.get('template');

  const [name, setName] = useState('Workout');
  const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
  const [notes, setNotes] = useState('');
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [restSeconds, setRestSeconds] = useState(settings.restTimerDefault);
  const [restRunning, setRestRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [timerRunning, setTimerRunning] = useState(true);
  const startRef = useRef(Date.now());
  const restRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Init from draft or start fresh
  useEffect(() => {
    if (draftWorkout && draftWorkout.exercises.length > 0) {
      setName(draftWorkout.name);
      setExercises(draftWorkout.exercises);
      setNotes(draftWorkout.notes || '');
      startRef.current = draftWorkout.startedAt;
      setElapsed(Math.floor((Date.now() - draftWorkout.startedAt) / 1000));
    } else if (templateName) {
      setName(templateName);
    }
  }, []);

  // Workout timer
  useEffect(() => {
    if (!timerRunning) return;
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, [timerRunning]);

  // Rest timer
  useEffect(() => {
    if (!restRunning) return;
    restRef.current = setInterval(() => {
      setRestSeconds((s) => {
        if (s <= 1) {
          setRestRunning(false);
          if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
          addToast('Rest complete!', 'info');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (restRef.current) clearInterval(restRef.current);
    };
  }, [restRunning, addToast]);

  // Auto-save draft
  useEffect(() => {
    if (!user || exercises.length === 0) return;
    const draft: Workout = {
      id: draftWorkout?.id || generateId(),
      userId: user.uid,
      name,
      exercises,
      startedAt: startRef.current,
      notes,
      totalVolume: calcVolume(exercises.flatMap((e) => e.sets)),
      isDraft: true,
    };
    saveDraft(draft);
  }, [exercises, name, notes, user]);

  const filteredExercises = STARTER_EXERCISES.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  ).slice(0, 12);

  const addExercise = (exName: string) => {
    setExercises((prev) => [...prev, createExercise(exName, prev.length)]);
    setSearch('');
    setShowSearch(false);
  };

  const addCustomExercise = () => {
    if (!search.trim()) return;
    addExercise(search.trim());
  };

  const removeExercise = (id: string) => {
    setExercises((prev) => prev.filter((e) => e.id !== id).map((e, i) => ({ ...e, order: i })));
  };

  const moveExercise = (id: string, dir: -1 | 1) => {
    setExercises((prev) => {
      const idx = prev.findIndex((e) => e.id === id);
      if (idx < 0) return prev;
      const next = idx + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      [copy[idx], copy[next]] = [copy[next], copy[idx]];
      return copy.map((e, i) => ({ ...e, order: i }));
    });
  };

  const updateSet = (exId: string, setId: string, field: keyof WorkoutSet, value: number | boolean) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId
          ? {
              ...ex,
              sets: ex.sets.map((s) => (s.id === setId ? { ...s, [field]: value } : s)),
            }
          : ex
      )
    );
  };

  const addSet = (exId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const last = ex.sets[ex.sets.length - 1];
        const newSet = createEmptySet(false);
        if (last) {
          newSet.weight = last.weight;
          newSet.reps = last.reps;
        }
        return { ...ex, sets: [...ex.sets, newSet] };
      })
    );
  };

  const duplicateSet = (exId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exId) return ex;
        const src = ex.sets.find((s) => s.id === setId);
        if (!src) return ex;
        return {
          ...ex,
          sets: [...ex.sets, { ...src, id: generateId(), completed: false }],
        };
      })
    );
  };

  const removeSet = (exId: string, setId: string) => {
    setExercises((prev) =>
      prev.map((ex) =>
        ex.id === exId ? { ...ex, sets: ex.sets.filter((s) => s.id !== setId) } : ex
      )
    );
  };

  const startRest = (secs?: number) => {
    setRestSeconds(secs || settings.restTimerDefault);
    setRestRunning(true);
    setShowRest(true);
  };

  const finishWorkout = async () => {
    if (!user || exercises.length === 0) {
      addToast('Add at least one exercise', 'error');
      return;
    }
    setSaving(true);
    try {
      const finishedAt = Date.now();
      const workout: Workout = {
        id: draftWorkout?.id || generateId(),
        userId: user.uid,
        name: name || 'Workout',
        exercises,
        startedAt: startRef.current,
        finishedAt,
        duration: elapsed,
        notes,
        totalVolume: calcVolume(exercises.flatMap((e) => e.sets.filter((s) => s.completed))),
        isDraft: false,
      };
      await saveWorkout(workout);

      // PR detection
      const existing = await getPRs(user.uid);
      const newPRs = detectPRs(workout, existing);
      if (newPRs.length > 0) {
        await savePRs(user.uid, newPRs);
        addToast(`🎉 ${newPRs.length} new PR${newPRs.length > 1 ? 's' : ''}!`, 'success');
      } else {
        addToast('Workout saved!', 'success');
      }

      clearActiveWorkout();
      navigate(`/workout/${workout.id}`);
    } catch (err) {
      addToast('Failed to save. Try again.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const cancelWorkout = () => {
    if (exercises.length > 0 && !confirm('Discard this workout?')) return;
    clearActiveWorkout();
    navigate('/app');
  };

  const units = settings.units;

  return (
    <div className="page fade-in" style={{ paddingBottom: showRest ? 120 : 80 }}>
      <div className="container">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <button onClick={cancelWorkout} className="btn btn-ghost btn-sm">
            <X size={18} /> Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTimerRunning((r) => !r)}
              className="btn btn-ghost btn-sm"
              title={timerRunning ? 'Pause' : 'Resume'}
            >
              {timerRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <span className="font-semibold text-sm" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatDuration(elapsed)}
            </span>
          </div>
          <button onClick={finishWorkout} className="btn btn-primary btn-sm" disabled={saving}>
            {saving ? 'Saving…' : 'Finish'}
          </button>
        </div>

        {/* Name */}
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Workout name"
          style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            border: 'none',
            background: 'transparent',
            padding: '0.25rem 0',
            marginBottom: '1rem',
          }}
        />

        {/* Exercises */}
        {exercises.map((ex, exIdx) => (
          <div key={ex.id} className="card mb-3">
            <div className="flex justify-between items-center mb-3">
              <h3 style={{ fontSize: '1rem' }}>{ex.name}</h3>
              <div className="flex gap-1">
                <button onClick={() => moveExercise(ex.id, -1)} className="btn-icon" disabled={exIdx === 0}>
                  <ChevronUp size={16} />
                </button>
                <button
                  onClick={() => moveExercise(ex.id, 1)}
                  className="btn-icon"
                  disabled={exIdx === exercises.length - 1}
                >
                  <ChevronDown size={16} />
                </button>
                <button onClick={() => removeExercise(ex.id)} className="btn-icon" style={{ color: 'var(--danger)' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Set headers */}
            <div
              className="text-xs text-muted mb-1"
              style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr 1fr 40px 40px',
                gap: 8,
                padding: '0 0 4px',
              }}
            >
              <span>Set</span>
              <span>{units}</span>
              <span>Reps</span>
              <span></span>
              <span></span>
            </div>

            {ex.sets.map((s, si) => (
              <div
                key={s.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '36px 1fr 1fr 40px 40px',
                  gap: 8,
                  alignItems: 'center',
                  marginBottom: 6,
                  opacity: s.completed ? 1 : 0.85,
                }}
              >
                <span
                  className="text-sm text-center font-medium"
                  style={{
                    color: s.isWarmup ? 'var(--text-muted)' : 'var(--text-secondary)',
                  }}
                >
                  {s.isWarmup ? 'W' : si + 1}
                </span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={s.weight || ''}
                  onChange={(e) => updateSet(ex.id, s.id, 'weight', parseFloat(e.target.value) || 0)}
                  placeholder="0"
                  style={{ padding: '0.5rem', textAlign: 'center' }}
                />
                <input
                  type="number"
                  inputMode="numeric"
                  value={s.reps || ''}
                  onChange={(e) => updateSet(ex.id, s.id, 'reps', parseInt(e.target.value) || 0)}
                  placeholder="0"
                  style={{ padding: '0.5rem', textAlign: 'center' }}
                />
                <button
                  onClick={() => {
                    updateSet(ex.id, s.id, 'completed', !s.completed);
                    if (!s.completed) startRest();
                  }}
                  className="btn-icon"
                  style={{
                    background: s.completed ? 'var(--accent)' : 'var(--bg-hover)',
                    color: s.completed ? '#fff' : 'var(--text-muted)',
                    borderRadius: 8,
                  }}
                >
                  <Check size={16} />
                </button>
                <button onClick={() => duplicateSet(ex.id, s.id)} className="btn-icon" title="Duplicate">
                  <Copy size={14} />
                </button>
              </div>
            ))}

            <div className="flex gap-2 mt-2">
              <button onClick={() => addSet(ex.id)} className="btn btn-secondary btn-sm">
                <Plus size={14} /> Set
              </button>
              <button
                onClick={() => {
                  setExercises((prev) =>
                    prev.map((e) =>
                      e.id === ex.id ? { ...e, sets: [...e.sets, createEmptySet(true)] } : e
                    )
                  );
                }}
                className="btn btn-ghost btn-sm"
              >
                Warm-up
              </button>
            </div>
          </div>
        ))}

        {/* Add exercise */}
        {showSearch ? (
          <div className="card mb-4">
            <div style={{ position: 'relative', marginBottom: 12 }}>
              <Search
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomExercise()}
                placeholder="Search or type exercise name"
                style={{ paddingLeft: 36 }}
              />
            </div>
            <div className="flex flex-col gap-1" style={{ maxHeight: 240, overflowY: 'auto' }}>
              {search && (
                <button
                  onClick={addCustomExercise}
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'flex-start' }}
                >
                  <Plus size={14} /> Add &quot;{search}&quot;
                </button>
              )}
              {filteredExercises.map((e) => (
                <button
                  key={e.name}
                  onClick={() => addExercise(e.name)}
                  style={{
                    textAlign: 'left',
                    padding: '0.625rem 0.75rem',
                    borderRadius: 8,
                    fontSize: '0.875rem',
                  }}
                  className="btn-ghost"
                >
                  <span className="font-medium">{e.name}</span>
                  <span className="text-muted text-xs" style={{ marginLeft: 8 }}>
                    {e.category}
                  </span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowSearch(false)} className="btn btn-ghost btn-sm mt-2">
              Close
            </button>
          </div>
        ) : (
          <button onClick={() => setShowSearch(true)} className="btn btn-secondary btn-block mb-4">
            <Plus size={18} /> Add Exercise
          </button>
        )}

        {/* Notes */}
        <div className="form-group">
          <label className="form-label">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="How did it feel?"
            rows={2}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Rest timer FAB area */}
        <div className="flex gap-2 mt-4">
          <button onClick={() => startRest(60)} className="btn btn-secondary btn-sm">
            <Timer size={14} /> 60s
          </button>
          <button onClick={() => startRest(90)} className="btn btn-secondary btn-sm">
            90s
          </button>
          <button onClick={() => startRest(120)} className="btn btn-secondary btn-sm">
            2m
          </button>
          <button onClick={() => startRest(180)} className="btn btn-secondary btn-sm">
            3m
          </button>
        </div>
      </div>

      {/* Rest timer overlay */}
      {showRest && (
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'var(--bg-elevated)',
            borderTop: '1px solid var(--border)',
            padding: '1rem',
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
          }}
        >
          <div>
            <div className="text-xs text-muted">Rest</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
              {Math.floor(restSeconds / 60)}:{String(restSeconds % 60).padStart(2, '0')}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setRestRunning((r) => !r)}
              className="btn btn-secondary btn-sm"
            >
              {restRunning ? <Pause size={16} /> : <Play size={16} />}
            </button>
            <button
              onClick={() => {
                setRestSeconds(settings.restTimerDefault);
                setRestRunning(true);
              }}
              className="btn btn-secondary btn-sm"
            >
              <RotateCcw size={16} />
            </button>
            <button onClick={() => { setShowRest(false); setRestRunning(false); }} className="btn btn-ghost btn-sm">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
