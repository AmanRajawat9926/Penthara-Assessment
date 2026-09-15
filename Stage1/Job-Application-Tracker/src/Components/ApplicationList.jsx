import ApplicationItem from './ApplicationItem';
import EditApplicationRow from './EditApplicationRow';

function ApplicationList({
  totalCount,
  filteredApplications,
  editingId,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onDelete
}) {
  // Empty State 1: No applications saved in the system at all
  if (totalCount === 0) {
    return (
      <section className="application-list empty-state">
        <h2>Applications (0)</h2>
        <div className="empty-message">
          <p className="empty-title">No applications added yet</p>
          <p className="empty-desc">Use the form above to add your first job application.</p>
        </div>
      </section>
    );
  }

  // Empty State 2: Applications exist, but none match current search / filter
  if (filteredApplications.length === 0) {
    return (
      <section className="application-list empty-state">
        <h2>Applications (0)</h2>
        <div className="empty-message">
          <p className="empty-title">No matching applications</p>
          <p className="empty-desc">Try clearing or adjusting your search criteria and round filter.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="application-list">
      <h2>Applications ({filteredApplications.length})</h2>
      <div className="application-items">
        {filteredApplications.map((application) =>
          editingId === application.id ? (
            <EditApplicationRow
              key={application.id}
              application={application}
              onSave={onSaveEdit}
              onCancel={onCancelEdit}
            />
          ) : (
            <ApplicationItem
              key={application.id}
              application={application}
              onEdit={onStartEdit}
              onDelete={onDelete}
            />
          )
        )}
      </div>
    </section>
  );
}

export default ApplicationList;