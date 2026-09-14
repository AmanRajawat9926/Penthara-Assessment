function ApplicationItem({ application, onDelete }) {
  return (
    <article className="application-item">
      <div>
        <h3>{application.company}</h3>

        <p>{application.role}</p>

        <p>
          <strong>Round:</strong> {application.round}
        </p>

        <p>
          <strong>Applied:</strong> {application.appliedDate}
        </p>

        <a
          href={application.jobLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          View Job
        </a>
      </div>

      <button
        type="button"
        className="delete-button"
        onClick={() => onDelete(application.id)}
      >
        Delete
      </button>
    </article>
  );
}

export default ApplicationItem;