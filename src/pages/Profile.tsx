import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, Flame, Dumbbell, Trophy, ExternalLink } from 'lucide-react';
import { useStore } from '../store/useStore';
import { format } from 'date-fns';

export default function Profile() {
  const user = useStore((s) => s.user);
  if (!user) return null;

  const social = user.socialLinks || {};
  const links = [
    { key: 'instagram', label: 'Instagram', url: social.instagram },
    { key: 'github', label: 'GitHub', url: social.github },
    { key: 'linkedin', label: 'LinkedIn', url: social.linkedin },
    { key: 'twitter', label: 'X / Twitter', url: social.twitter },
    { key: 'website', label: 'Website', url: social.website },
  ].filter((l) => l.url);

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 560 }}>
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-4">
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                background: 'var(--accent-muted)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: 'var(--accent)',
                overflow: 'hidden',
                flexShrink: 0,
              }}
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                user.name?.[0]?.toUpperCase()
              )}
            </div>
            <div>
              <h1 style={{ fontSize: '1.375rem' }}>{user.name}</h1>
              <p className="text-secondary text-sm">@{user.username}</p>
              <p className="text-muted text-xs mt-1">
                Joined {format(user.joinedAt, 'MMM yyyy')} · {user.visibility}
              </p>
            </div>
          </div>
          <Link to="/settings" className="btn btn-ghost btn-sm">
            <Settings size={18} />
          </Link>
        </div>

        {user.bio && (
          <p className="text-sm text-secondary mb-4" style={{ lineHeight: 1.6 }}>
            {user.bio}
          </p>
        )}

        {/* Stats */}
        <div className="grid-2 mb-4">
          <div className="card card-sm text-center">
            <Dumbbell size={18} className="text-muted" style={{ margin: '0 auto 4px' }} />
            <div className="font-bold" style={{ fontSize: '1.25rem' }}>{user.totalWorkouts}</div>
            <div className="text-xs text-muted">Workouts</div>
          </div>
          <div className="card card-sm text-center">
            <Flame size={18} className="text-muted" style={{ margin: '0 auto 4px' }} />
            <div className="font-bold" style={{ fontSize: '1.25rem' }}>{user.currentStreak}</div>
            <div className="text-xs text-muted">Day streak</div>
          </div>
          <div className="card card-sm text-center">
            <Trophy size={18} className="text-muted" style={{ margin: '0 auto 4px' }} />
            <div className="font-bold" style={{ fontSize: '1.25rem' }}>{user.prCount}</div>
            <div className="text-xs text-muted">PRs</div>
          </div>
          <div className="card card-sm text-center">
            <Flame size={18} className="text-muted" style={{ margin: '0 auto 4px' }} />
            <div className="font-bold" style={{ fontSize: '1.25rem' }}>{user.longestStreak}</div>
            <div className="text-xs text-muted">Longest</div>
          </div>
        </div>

        {links.length > 0 && (
          <div className="card mb-4">
            <h2 style={{ fontSize: '0.875rem', marginBottom: 8 }}>Links</h2>
            <div className="flex flex-col gap-2">
              {links.map((l) => (
                <a
                  key={l.key}
                  href={l.url!.startsWith('http') ? l.url : `https://${l.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-accent"
                >
                  <ExternalLink size={14} />
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <Link to="/history" className="btn btn-secondary btn-block">
            Workout History
          </Link>
          <Link to="/calendar" className="btn btn-secondary btn-block">
            Consistency Calendar
          </Link>
          <Link to="/goals" className="btn btn-secondary btn-block">
            Goals & Achievements
          </Link>
        </div>
      </div>
    </div>
  );
}
