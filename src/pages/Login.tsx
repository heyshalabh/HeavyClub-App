import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn, signInWithGoogle, resetPassword } from '../services/auth';
import { useStore } from '../store/useStore';
import { Mail, Lock, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const addToast = useStore((s) => s.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signIn(email, password);
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to sign in';
      setError(msg.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '').trim());
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/app');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!email) {
      setError('Enter your email first');
      return;
    }
    try {
      await resetPassword(email);
      setResetSent(true);
      addToast('Password reset email sent', 'success');
    } catch {
      setError('Could not send reset email');
    }
  };

  return (
    <div
      className="fade-in"
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <div
              style={{
                width: 40,
                height: 40,
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
          </Link>
          <h1 style={{ fontSize: '1.5rem' }}>Welcome back</h1>
          <p className="text-secondary text-sm mt-1">Sign in to continue training</p>
        </div>

        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div
              className="form-error"
              style={{
                background: 'rgba(239,68,68,0.1)',
                padding: '0.75rem',
                borderRadius: 8,
                marginBottom: '1rem',
              }}
            >
              {error}
            </div>
          )}
          {resetSent && (
            <div
              style={{
                background: 'var(--accent-muted)',
                color: 'var(--accent)',
                padding: '0.75rem',
                borderRadius: 8,
                marginBottom: '1rem',
                fontSize: '0.875rem',
              }}
            >
              Check your email for a reset link.
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                style={{ paddingLeft: 36 }}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                style={{ paddingLeft: 36 }}
                autoComplete="current-password"
              />
            </div>
          </div>

          <button type="button" onClick={handleReset} className="text-sm text-accent" style={{ marginBottom: '1rem' }}>
            Forgot password?
          </button>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? <Loader2 size={18} className="spinner" style={{ border: 'none', animation: 'spin 0.7s linear infinite' }} /> : 'Sign In'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '1.25rem 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            <span className="text-muted text-xs">OR</span>
            <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          </div>

          <button type="button" onClick={handleGoogle} className="btn btn-secondary btn-block" disabled={loading}>
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm text-secondary mt-4">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-accent font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
