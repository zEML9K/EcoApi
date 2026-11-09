import React, { useState, useEffect } from 'react';
import StationTable from './components/StationTable';
import AirQualityTable from './components/AirQualityTable';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
  } catch {}
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  return (
    <div className="app">
      <header className="app-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Світла тема' : 'Темна тема'}
          aria-label="Перемкнути тему"
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
        <h1>🌿 Система екологічного моніторингу</h1>
        <p>React + Express + MongoDB</p>
      </header>
      <main>
        <StationTable />
        <AirQualityTable />
      </main>
    </div>
  );
}

export default App;