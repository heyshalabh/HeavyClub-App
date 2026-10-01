import { useState } from 'react';
import { Users, Trophy, Megaphone, Hash } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function Club() {
  const user = useStore((s) => s.user);
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState(!!user?.clubId);

  // Placeholder club for V1 structure
  const club = joined
    ? {
        name: 'MATS GYM',
        description: 'College gym community — train together, stay consistent.',
        memberCount: 34,
        workoutsThisMonth: 186,
      }
    : null;

  const handleJoin = () => {
    if (code.trim().length < 4) return;
    setJoined(true);
  };

  return (
    <div className="page fade-in">
      <div className="container">
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Club</h1>

        {!joined ? (
          <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
            <Users size={40} className="text-muted" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
            <h2 style={{ fontSize: '1.125rem', marginBottom: 8 }}>Join a Gym Club</h2>
            <p className="text-secondary text-sm mb-4">
              Enter a join code from your college gym or community.
            </p>
            <div className="form-group" style={{ maxWidth: 280, margin: '0 auto 1rem' }}>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="JOIN CODE"
                style={{ textAlign: 'center', letterSpacing: 2, fontWeight: 600 }}
              />
            </div>
            <button onClick={handleJoin} className="btn btn-primary" disabled={code.length < 4}>
              <Hash size={16} /> Join Club
            </button>
            <p className="text-muted text-xs mt-4">
              Club features: announcements, challenges, member activity (no private workout history).
            </p>
          </div>
        ) : (
          <>
            <div className="card mb-4">
              <h2 style={{ fontSize: '1.25rem' }}>{club!.name}</h2>
              <p className="text-secondary text-sm mt-1 mb-3">{club!.description}</p>
              <div className="flex gap-4">
                <div>
                  <div className="font-bold">{club!.memberCount}</div>
                  <div className="text-xs text-muted">Members</div>
                </div>
                <div>
                  <div className="font-bold">{club!.workoutsThisMonth}</div>
                  <div className="text-xs text-muted">Workouts this month</div>
                </div>
              </div>
            </div>

            <div className="card mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Trophy size={18} className="text-accent" />
                <h2 style={{ fontSize: '0.9375rem' }}>Challenges</h2>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { title: '12 Workouts in October', progress: 5, target: 12 },
                  { title: '3× every week', progress: 2, target: 3 },
                  { title: '30-Day Consistency', progress: 8, target: 30 },
                ].map((c) => (
                  <div key={c.title} style={{ padding: '0.75rem', background: 'var(--bg-hover)', borderRadius: 8 }}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{c.title}</span>
                      <span className="text-muted">
                        {c.progress}/{c.target}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${Math.round((c.progress / c.target) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <div className="flex items-center gap-2 mb-3">
                <Megaphone size={18} className="text-accent" />
                <h2 style={{ fontSize: '0.9375rem' }}>Announcements</h2>
              </div>
              <div className="text-sm text-secondary">
                <p className="mb-2">
                  <strong>Welcome to MATS GYM!</strong>
                </p>
                <p>Stay consistent. Log your workouts. Climb the consistency challenges.</p>
                <p className="text-xs text-muted mt-2">Posted recently</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
