import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="page fade-in">
      <div className="container" style={{ maxWidth: 680 }}>
        <Link to="/" className="text-sm text-accent mb-4" style={{ display: 'inline-block' }}>
          ← Back
        </Link>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Health & Fitness Disclaimer</h1>
        <div className="text-sm" style={{ lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p className="mb-3">
            <strong style={{ color: 'var(--text)' }}>HeavyClub is not medical, nutrition, physiotherapy, or professional healthcare advice.</strong>
          </p>
          <p className="mb-3">
            The information and tools provided in HeavyClub are for general fitness tracking and educational purposes only. Always consult a qualified healthcare professional before starting any exercise program, especially if you have pre-existing conditions, injuries, or health concerns.
          </p>
          <p className="mb-3">
            You assume full responsibility for how you use the data and features in this app. HeavyClub and its creators are not liable for any injury, damage, or health outcome resulting from use of the application.
          </p>
          <p className="mb-3">
            Estimated one-rep max and similar calculations are approximations and should not replace professional coaching or medical guidance.
          </p>
          <p>
            By using HeavyClub you acknowledge that you understand and accept this disclaimer.
          </p>
        </div>
      </div>
    </div>
  );
}
