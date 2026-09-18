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
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      // Clean invalid records on startup
      return parsed.filter(
        (app) => app && typeof app === 'object' && app.id && app.company && app.role
      );
    } catch {
      return [];
    }
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRound, setSelectedRound] = useState('All');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
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

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedRound('All');
  };

  const filteredAndSortedApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return applications
      .filter((app) => {
        const matchesRound =
          selectedRound === 'All' || app.round === selectedRound;
        const matchesSearch =
          !query ||
          app.company.toLowerCase().includes(query) ||
          app.role.toLowerCase().includes(query);

        return matchesRound && matchesSearch;
      })
      .sort((a, b) => {
        // Requirement 3: Sorted by applied date (newest first)
        const dateDiff = b.appliedDate.localeCompare(a.appliedDate);
        if (dateDiff !== 0) return dateDiff;

        // Tiebreakers: Creation timestamp then unique ID string comparison
        const timeA = a.createdAt || 0;
        const timeB = b.createdAt || 0;
        if (timeA !== timeB) return timeB - timeA;

        return String(b.id).localeCompare(String(a.id));
      });
  }, [applications, searchQuery, selectedRound]);

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-content">
          <h1>Job Application Tracker</h1>
          <p className="subtitle">
            Track your pipeline stages, inspect stale applications, and stay organized.
          </p>
        </div>
        <HeaderStats applications={applications} />
      </header>

      <main className="app-main">
        <ApplicationForm onAddApplication={handleAddApplication} />

        <section className="pipeline-section">
          <FilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedRound={selectedRound}
            onRoundChange={setSelectedRound}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                handleClearFilters();
              }
            }}
          />

          <ApplicationList
            totalCount={applications.length}
            filteredApplications={filteredAndSortedApplications}
            editingId={editingId}
            onStartEdit={setEditingId}
            onCancelEdit={() => setEditingId(null)}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteApplication}
            onClearFilters={handleClearFilters}
          />
        </section>
      </main>
    </div>
  );
}

export default App;