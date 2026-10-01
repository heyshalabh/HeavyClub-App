import { Link } from 'react-router-dom';
import { Dumbbell, TrendingUp, Flame, Users, ChevronRight } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Navigate } from 'react-router-dom';

const features = [
  { icon: Dumbbell, title: 'Track workouts', desc: 'Log sets fast with search or free text.' },
  { icon: TrendingUp, title: 'Monitor progress', desc: 'Charts, PRs and volume over time.' },
  { icon: Flame, title: 'Build consistency', desc: 'Streaks and calendar keep you coming back.' },
  { icon: Users, title: 'Join your gym club', desc: 'College or gym community challenges.' },
];

export default function Landing() {
  const user = useStore((s) => s.user);
  if (user) return <Navigate to="/app" replace />;

  return (
    <div className="fade-in" style={{ minHeight: '100dvh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <header
        style={{
          padding: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: 1100,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              color: '#fff',
            }}
          >
            H
          </div>
          <span style={{ fontWeight: 700, fontSize: '1.25rem' }}>HeavyClub</span>
        </div>
        <Link to="/login" className="btn btn-ghost btn-sm">
          Sign In
        </Link>
      </header>

      {/* Hero */}
      <section
        className="container"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '3rem 1rem 2rem',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            marginBottom: '0.5rem',
          }}
        >
          HeavyClub
        </h1>
        <p
          style={{
            fontSize: 'clamp(1.125rem, 3vw, 1.5rem)',
            color: 'var(--accent)',
            fontWeight: 600,
            marginBottom: '1rem',
          }}
        >
          Train. Track. Repeat.
        </p>
        <p
          className="text-secondary"
          style={{
            maxWidth: 420,
            fontSize: '1.0625rem',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          Your simple workout companion for tracking training, progress and consistency.
        </p>
        <div className="flex gap-3" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/signup" className="btn btn-primary btn-lg">
            Get Started
            <ChevronRight size={18} />
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            Sign In
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="container" style={{ padding: '2rem 1rem 3rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card" style={{ textAlign: 'left' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  background: 'var(--accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.75rem',
                }}
              >
                <Icon size={20} color="var(--accent)" />
              </div>
              <h3 style={{ fontSize: '1rem', marginBottom: 4 }}>{title}</h3>
              <p className="text-secondary text-sm">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '1.5rem 1rem',
          textAlign: 'center',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem 1.5rem',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Link to="/privacy" className="text-sm text-secondary">
            Privacy
          </Link>
          <Link to="/terms" className="text-sm text-secondary">
            Terms
          </Link>
          <Link to="/disclaimer" className="text-sm text-secondary">
            Fitness Disclaimer
          </Link>
          <Link to="/contact" className="text-sm text-secondary">
            Contact
          </Link>
        </div>
        <p className="text-muted text-xs">
          © 2026 HeavyClub. All rights reserved.
          <br />
          Built by Shalabh Suman
        </p>
      </footer>
    </div>
  );
}
