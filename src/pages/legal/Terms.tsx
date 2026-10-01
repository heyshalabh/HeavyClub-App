import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 680 }}>
        <Link to="/" className="text-sm text-accent mb-4" style={{ display: 'inline-block' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Terms of Service</h1>
        <p className="text-secondary text-sm mb-4">Last updated: October 2026</p>
        <div className="text-sm" style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p className="mb-3">
            By using HeavyClub you agree to these terms. HeavyClub is a free workout tracking application provided as-is.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Use of the Service</h2>
          <p className="mb-3">
            You are responsible for the accuracy of data you enter and for keeping your account secure. Do not use the service for illegal purposes or to harass others in club features.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Content</h2>
          <p className="mb-3">
            You retain ownership of your workout data. By using club features you allow limited display of non-private activity statistics as configured by club settings.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Limitation of Liability</h2>
          <p className="mb-3">
            HeavyClub is not liable for injuries, health outcomes, or losses arising from use of the app. Training involves risk; train responsibly.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Changes</h2>
          <p>
            We may update these terms. Continued use after changes constitutes acceptance.
          </p>
        </div>
        <p className="text-xs text-muted mt-8">
          Template for later legal review.
        </p>
      </div>
    </div>
  );
}
