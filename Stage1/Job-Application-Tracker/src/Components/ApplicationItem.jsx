import { calculateDaysSinceApplied, isApplicationStale } from '../Utils/helpers';

function ApplicationItem({ application, onEdit, onDelete }) {
  const daysSince = calculateDaysSinceApplied(application.appliedDate);
  const isStale = isApplicationStale(application);

  return (
    <article className={`application-item ${isStale ? 'stale-border' : ''}`}>
      <div className="application-details">
        <div className="title-row">
          <h3>{application.company}</h3>
          <span className={`round-badge badge-${application.round.toLowerCase()}`}>
            {application.round}
          </span>
          {isStale && (
            <span className="stale-badge" title="No movement in >14 days while in Applied or Screen">
              Stale
            </span>
          )}
        </div>

        <p className="role-text">{application.role}</p>

        <div className="meta-row">
          <span>
            <strong>Applied:</strong> {application.appliedDate}
          </span>
          <span className="days-ago">
            ({daysSince} {daysSince === 1 ? 'day' : 'days'} ago)
          </span>
          <span className="meta-separator">•</span>
          <a
            href={application.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className="job-link"
          >
            View Job Posting ↗
          </a>
        </div>
      </div>

      <div className="item-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit(application.id)}
        >
          Edit
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(application.id)}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ApplicationItem;