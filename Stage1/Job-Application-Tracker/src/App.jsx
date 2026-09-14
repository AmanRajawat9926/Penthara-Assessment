import { useEffect, useState } from 'react';
import ApplicationForm from './Components/ApplicationForm';
import ApplicationList from './Components/ApplicationList';
import './App.css';

const STORAGE_KEY = 'job_application_tracker';

function App() {
  const [applications, setApplications] = useState(() => {
    const savedApplications = localStorage.getItem(STORAGE_KEY);

    if (!savedApplications) {
      return [];
    }

    try {
      return JSON.parse(savedApplications);
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(applications)
    );
  }, [applications]);

  const handleAddApplication = (application) => {
    setApplications((previous) => [
      ...previous,
      application
    ]);
  };

  const handleDeleteApplication = (id) => {
    setApplications((previous) =>
      previous.filter((application) => application.id !== id)
    );
  };

  return (
    <main className="app">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <p>Track your applications in one place.</p>
      </header>

      <ApplicationForm
        onAddApplication={handleAddApplication}
      />

      <ApplicationList
        applications={applications}
        onDelete={handleDeleteApplication}
      />
    </main>
  );
}

export default App;