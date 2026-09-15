import { ROUNDS } from '../Utils/helpers';

function FilterBar({ searchQuery, onSearchChange, selectedRound, onRoundChange }) {
  return (
    <div className="filter-bar">
      <div className="search-field">
        <label htmlFor="search-input" className="sr-only">Search</label>
        <input
          id="search-input"
          type="search"
          placeholder="Search by company or role..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="round-filter" className="sr-only">Filter by Round</label>
        <select
          id="round-filter"
          value={selectedRound}
          onChange={(e) => onRoundChange(e.target.value)}
        >
          <option value="All">All Rounds</option>
          {ROUNDS.map((round) => (
            <option key={round} value={round}>
              {round}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default FilterBar;