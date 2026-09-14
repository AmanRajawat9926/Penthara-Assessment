import ApplicationItem from './ApplicationItem';

function ApplicationList({ applications, onDelete }) {
  if (applications.length === 0) {
    return (
      <section className="application-list">
        <h2>Applications</h2>
        <p>No applications added yet.</p>
      </section>
    );
  }

  const sortedApplications = [...applications].sort(
    (first, second) =>
      new Date(second.appliedDate) - new Date(first.appliedDate)
  );

  return (
    <section className="application-list">
      <h2>Applications</h2>

      <div className="application-items">
        {sortedApplications.map((application) => (
          <ApplicationItem
            key={application.id}
            application={application}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}

export default ApplicationList;