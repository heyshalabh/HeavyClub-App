import { useState } from 'react';
import { Search, Plus } from 'lucide-react';
import { STARTER_EXERCISES, EXERCISE_CATEGORIES } from '../lib/exerciseLibrary';
import type { ExerciseCategory } from '../types';

export default function Exercises() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ExerciseCategory | 'All'>('All');

  const filtered = STARTER_EXERCISES.filter((e) => {
    const matchCat = category === 'All' || e.category === category;
    const matchSearch =
      !search ||
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.targetMuscle.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Exercise Library</h1>

        <div style={{ position: 'relative', marginBottom: 12 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises"
            style={{ paddingLeft: 36 }}
          />
        </div>

        <div className="flex gap-2 mb-4" style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <button
            onClick={() => setCategory('All')}
            className={`btn btn-sm ${category === 'All' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ flexShrink: 0 }}
          >
            All
          </button>
          {EXERCISE_CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`btn btn-sm ${category === c ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flexShrink: 0 }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((e) => (
            <div key={e.name} className="card card-sm">
              <div className="font-medium text-sm">{e.name}</div>
              <div className="text-xs text-muted mt-1">
                {e.category} · {e.targetMuscle} · {e.equipment}
              </div>
              {e.description && (
                <p className="text-xs text-secondary mt-1">{e.description}</p>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="state-box">
              <p>No exercises found</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-muted mt-6">
          You can also type any exercise name freely while logging a workout.
        </p>
      </div>
    </div>
  );
}
