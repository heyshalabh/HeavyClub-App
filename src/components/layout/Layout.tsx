import { Outlet, NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Dumbbell,
  TrendingUp,
  Users,
  User,
  Settings,
  Target,
  BookOpen,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const mobileLinks = [
  { to: '/app', icon: Home, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workout' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/club', icon: Users, label: 'Club' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const desktopLinks = [
  { to: '/app', icon: Home, label: 'Home' },
  { to: '/workout', icon: Dumbbell, label: 'Workouts' },
  { to: '/history', icon: Calendar, label: 'History' },
  { to: '/progress', icon: TrendingUp, label: 'Progress' },
  { to: '/exercises', icon: BookOpen, label: 'Exercises' },
  { to: '/goals', icon: Target, label: 'Goals' },
  { to: '/club', icon: Users, label: 'Club' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Layout() {
  const location = useLocation();
  const { user } = useStore();
  const isWorkoutActive = location.pathname === '/workout';

  return (
    <div style={{ display: 'flex', minHeight: '100dvh' }}>
      {/* Desktop sidebar */}
      <aside
        className="desktop-nav"
        style={{
          width: 220,
          borderRight: '1px solid var(--border)',
          background: 'var(--bg-elevated)',
          padding: '1.5rem 0.75rem',
          flexDirection: 'column',
          position: 'sticky',
          top: 0,
          height: '100dvh',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 0.75rem', marginBottom: '2rem' }}>
          <NavLink to="/app" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                background: 'var(--accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                color: '#fff',
                fontSize: 14,
              }}
            >
              H
            </div>
            <span style={{ fontWeight: 700, fontSize: '1.125rem' }}>HeavyClub</span>
          </NavLink>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          {desktopLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '0.625rem 0.75rem',
                borderRadius: 8,
                fontSize: '0.875rem',
                fontWeight: 500,
                color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                background: isActive ? 'var(--accent-muted)' : 'transparent',
              })}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <div
            style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--border)',
              marginTop: '1rem',
            }}
          >
            <NavLink
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                fontSize: '0.875rem',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'var(--accent-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  color: 'var(--accent)',
                  fontSize: 13,
                  overflow: 'hidden',
                }}
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  user.name?.[0]?.toUpperCase() || 'U'
                )}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div className="truncate font-medium" style={{ fontSize: '0.8125rem' }}>
                  {user.name}
                </div>
                <div className="text-muted truncate" style={{ fontSize: '0.75rem' }}>
                  @{user.username}
                </div>
              </div>
            </NavLink>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0 }}>
        <Outlet />
      </main>

      {/* Mobile bottom nav — hide during active workout logging for more space */}
      {!isWorkoutActive && (
        <nav className="bottom-nav">
          {mobileLinks.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </div>
  );
}
