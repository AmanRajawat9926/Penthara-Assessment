import { useEffect, useState, useMemo } from 'react';
import ApplicationForm from './Components/ApplicationForm';
import ApplicationList from './Components/ApplicationList';
import HeaderStats from './Components/HeaderStats';
import FilterBar from './Components/FilterBar';
import './App.css';

const STORAGE_KEY = 'job_application_tracker';

function App() {
  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState('All');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  }, [applications]);

  const handleAddApplication = (newApp) => {
    setApplications((prev) => [newApp, ...prev]);
  };

  const handleSaveEdit = (updatedApp) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === updatedApp.id ? updatedApp : app))
    );
    setEditingId(null);
  };

  const handleDeleteApplication = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
    if (editingId === id) setEditingId(null);
  };


  const filteredAndSortedApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
      .filter((app) => {
        const matchesRound = selectedRound === 'All' || app.round === selectedRound;
        const query = searchQuery.trim().toLowerCase();
        const matchesSearch =
          !query ||
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query);

        return matchesRound && matchesSearch;
      });
  }, [applications, searchQuery, selectedRound]);

  return (
    <main className="app-container">
      <header className="app-header">
        <h1>Job Application Tracker</h1>
        <p>Track your applications and keep tabs on stale rounds.</p>
        <HeaderStats applications={applications} />
      </header>

      <ApplicationForm onAddApplication={handleAddApplication} />

      <section className="list-wrapper">
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedRound={selectedRound}
          onRoundChange={setSelectedRound}
        />

        <ApplicationList
          totalCount={applications.length}
          filteredApplications={filteredAndSortedApplications}
          editingId={editingId}
          onStartEdit={setEditingId}
          onCancelEdit={() => setEditingId(null)}
          onSaveEdit={handleSaveEdit}
          onDelete={handleDeleteApplication}
        />
      </section>
    </main>
  );
}

export default App;