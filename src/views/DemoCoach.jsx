import { useEffect, useState } from 'react';
import { Icon } from '../components/Icon.jsx';
import { cx } from '../lib/util.js';

const STEPS = [
  'Browse three posts',
  'Reach the stopping point',
  'Select Find Your Next Moment',
  'Choose mood, time and interests',
  'Receive personalized activities',
  'Start the 3-Photo Quest',
  'Complete the challenge',
  'View the updated dashboard',
];

// Works out which demo step the visitor is on from what is on screen.
export function demoStep({ state, route, disc, celebrate }) {
  const s = state.session;
  if (state.totals.completed > 0) return route.name === 'you' && !celebrate ? 8 : 7;
  if (state.active) return 6;
  if (route.name === 'activity') return 5;
  if (route.name === 'discover') return disc.step === 3 ? 5 : 3;
  if (s.ended) return 2;
  return 0;
}

function text(step, viewed, route) {
  switch (step) {
    case 0:
      return `Scroll the feed and look at three posts (${Math.min(viewed, 3)} of 3).`;
    case 2:
      return 'You reached the stopping point. Tap Find Your Next Moment.';
    case 3:
      return 'Pick a mood, a time and your interests. Try Creative, 10 minutes and Photography.';
    case 5:
      return route === 'activity' ? 'Tap Start challenge.' : 'These matches are based on your picks. Open The 3-Photo Quest.';
    case 6:
      return 'Take your three photos (or pretend), then tap Mark as completed.';
    case 7:
      return 'Moment completed. Open your dashboard to see it counted.';
    default:
      return 'That’s the whole journey: Browse, Pause, Discover, Do. Your own data was never touched.';
  }
}

export function DemoCoach({ step, viewed, routeName, onExit, onRestart, onDashboard }) {
  const finished = step >= 8;
  const [small, setSmall] = useState(false);
  useEffect(() => setSmall(false), [step]);
  if (small) {
    return (
      <button type="button" className="coach coach-mini" onClick={() => setSmall(false)} aria-label={`Demo Mode, step ${Math.min(step + 1, 8)} of 8. Show instructions`}>
        <span className="coach-badge">Demo</span>
        <span className="tnum">{finished ? 'Complete' : `Step ${step + 1} of 8`}</span>
        <Icon name="chevronRight" size={16} />
      </button>
    );
  }
  return (
    <div className={cx('coach', finished && 'is-done')} role="status" aria-live="polite">
      <div className="coach-top">
        <span className="coach-badge">Demo Mode</span>
        <span className="coach-count">{finished ? 'Complete' : `Step ${step + 1} of 8`}</span>
        <button type="button" className="coach-exit" onClick={() => setSmall(true)}>
          Hide
        </button>
        <button type="button" className="coach-exit" onClick={onExit}>
          Exit
        </button>
      </div>
      <div className="coach-bar" aria-hidden="true">
        {STEPS.map((_, i) => (
          <span key={i} className={cx(i < step && 'done', i === step && 'now')} />
        ))}
      </div>
      <p className="coach-text">{text(step, viewed, routeName)}</p>
      {step === 7 ? (
        <button type="button" className="btn btn-mint btn-sm" onClick={onDashboard}>
          Open dashboard
          <Icon name="arrowRight" size={16} />
        </button>
      ) : null}
      {finished ? (
        <div className="coach-actions">
          <button type="button" className="btn btn-mint btn-sm" onClick={onRestart}>
            <Icon name="reset" size={16} />
            Run it again
          </button>
          <button type="button" className="btn btn-ghost-night btn-sm" onClick={onExit}>
            Exit demo
          </button>
        </div>
      ) : null}
    </div>
  );
}
