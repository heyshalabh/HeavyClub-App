import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';

export default function Contact() {
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const addToast = useStore((s) => s.addToast);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    // In production, send to a Firebase collection or email service
    setSent(true);
    addToast('Feedback received — thank you!', 'success');
    setMessage('');
  };

  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 480 }}>
        <Link to="/" className="text-sm text-accent mb-4" style={{ display: 'inline-block' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Contact / Feedback</h1>
        <p className="text-secondary text-sm mb-4">
          Questions, bug reports, or ideas for HeavyClub? Send a message below.
        </p>

        {sent ? (
          <div className="card text-center">
            <p className="text-accent font-medium">Thanks for your feedback!</p>
            <button onClick={() => setSent(false)} className="btn btn-secondary btn-sm mt-3">
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card">
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Your message…"
                required
                style={{ resize: 'vertical' }}
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Send
            </button>
          </form>
        )}

        <p className="text-center text-xs text-muted mt-6">
          Built by Shalabh Suman · © 2026 HeavyClub
        </p>
      </div>
    </div>
  );
}
