import { calculateDaysSinceApplied, isApplicationStale, formatUrl } from '../Utils/helpers';

function ApplicationItem({ application, onEdit, onDelete }) {
  const daysSince = calculateDaysSinceApplied(application.appliedDate);
  const isStale = isApplicationStale(application);
  const hrefUrl = formatUrl(application.jobLink);

  return (
    <article
      className={`application-item ${isStale ? 'is-stale' : ''}`}
      data-testid="application-row"
    >
      <div className="application-details">
        <div className="title-row">
          <h3 className="company-title">{application.company}</h3>
          <span className={`round-badge badge-${application.round.toLowerCase()}`}>
            {application.round}
          </span>
          {isStale && (
            <span
              className="stale-badge"
              title="Application has been in Applied/Screen for more than 14 days"
            >
              ⚠ Stale (&gt;14d)
            </span>
          )}
        </div>

        <p className="role-text">{application.role}</p>

        <div className="meta-row">
          <span className="meta-applied">
            <strong>Applied:</strong> {application.appliedDate}
          </span>
          <span className="days-ago">
            ({daysSince} {daysSince === 1 ? 'day' : 'days'} ago)
          </span>
          <span className="meta-separator">•</span>
          <a
            href={hrefUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="job-link"
            title="Open job link in new tab"
          >
            Job Link ↗
          </a>
        </div>
      </div>

      <div className="item-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit(application.id)}
          aria-label={`Edit application for ${application.company}`}
        >
          Edit
        </button>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(application.id)}
          aria-label={`Delete application for ${application.company}`}
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default ApplicationItem;