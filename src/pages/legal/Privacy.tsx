import { Link } from 'react-router-dom';

export default function Privacy() {
  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 680 }}>
        <Link to="/" className="text-sm text-accent mb-4" style={{ display: 'inline-block' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Privacy Policy</h1>
        <p className="text-secondary text-sm mb-4">Last updated: October 2026</p>
        <div className="text-sm" style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p className="mb-3">
            HeavyClub (&quot;we&quot;, &quot;our&quot;) respects your privacy. This policy describes how we collect, use, and protect your information when you use the HeavyClub application.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Information We Collect</h2>
          <p className="mb-3">
            Account information (name, username, email), profile data you choose to provide, workout logs you create, and usage data necessary to operate the service. We do not sell your personal data.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>How We Use Data</h2>
          <p className="mb-3">
            To provide workout tracking, progress analytics, club features, and improve the product. Workout history is private by default and only shared according to your profile visibility settings.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Data Storage</h2>
          <p className="mb-3">
            Data is stored using Firebase (Google Cloud). Access is controlled by security rules so that other users cannot read your private workouts.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Your Rights</h2>
          <p className="mb-3">
            You may export your workout data from Settings and request account deletion. Contact us via the Contact page for data deletion requests.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.5rem' }}>Contact</h2>
          <p>
            For privacy questions, use the Contact / Feedback page in the app.
          </p>
        </div>
        <p className="text-xs text-muted mt-8">
          This is a template suitable for later legal review. It is not formal legal advice.
        </p>
      </div>
    </div>
  );
}
