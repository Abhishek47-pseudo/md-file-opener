import React, { useState, useRef, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, setSearchTerm, results = [], onResultClick }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setOpen(results && results.length > 0 && searchTerm.trim().length > 0);
  }, [results, searchTerm]);

  useEffect(() => {
    const handleDocClick = (e) => { if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('click', handleDocClick);
    return () => document.removeEventListener('click', handleDocClick);
  }, []);

  return (
    <div className="search-bar" ref={wrapperRef}>
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search in document... (Ctrl+F)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchTerm('');
              setOpen(false);
            }
          }}
        />
        {searchTerm && (
          <button
            className="search-clear"
            onClick={() => { setSearchTerm(''); setOpen(false); }}
            title="Clear search (Esc)"
          >
            ✕
          </button>
        )}
      </div>

      {open && (
        <div className="search-results" role="listbox" aria-label="Search results">
          {results.slice(0, 8).map((r, idx) => (
            <button key={r.id} className="search-result-item" onClick={() => { onResultClick(r.id); setOpen(false); }} role="option" aria-selected={false}>
              <div className="sr-title">{r.title}</div>
              <div className="sr-snippet">{r.snippet}</div>
            </button>
          ))}
          {results.length === 0 && <div className="search-empty">No results</div>}
        </div>
      )}

      <div className="search-info">
        <small>Type to search • Press Esc to clear</small>
      </div>
    </div>
  );
};

export default SearchBar;
