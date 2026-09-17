import { ROUNDS } from '../Utils/helpers';

function HeaderStats({ applications }) {
  const counts = ROUNDS.reduce((acc, round) => {
    acc[round] = 0;
    return acc;
  }, {});

  applications.forEach((app) => {
    if (counts[app.round] !== undefined) {
      counts[app.round] += 1;
    }
  });

  return (
    <section className="header-stats" aria-label="Pipeline overview">
      <div className="stat-card total">
        <span className="stat-label">Total</span>
        <span className="stat-count">{applications.length}</span>
      </div>
      {ROUNDS.map((round) => (
        <div key={round} className={`stat-card stat-${round.toLowerCase()}`}>
          <span className="stat-label">{round}</span>
          <span className="stat-count">{counts[round]}</span>
        </div>
      ))}
    </section>
  );
}

export default HeaderStats;