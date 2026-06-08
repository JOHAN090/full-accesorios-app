import React, { useState, useEffect, useCallback } from 'react';
import { HiOutlineSearch, HiOutlineX } from 'react-icons/hi';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = 'Buscar accesorios...', value = '' }) => {
  const [query, setQuery] = useState(value);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query, onSearch]);

  // Sync external value changes
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const handleClear = useCallback(() => {
    setQuery('');
  }, []);

  return (
    <div className="search-bar" id="search-bar">
      <HiOutlineSearch className="search-bar-icon" />
      <input
        type="text"
        className="search-bar-input"
        id="search-bar-input"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Buscar productos"
      />
      {query && (
        <button
          className="search-bar-clear"
          id="search-bar-clear"
          onClick={handleClear}
          aria-label="Limpiar búsqueda"
        >
          <HiOutlineX />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
