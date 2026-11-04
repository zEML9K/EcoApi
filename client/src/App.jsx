import React from 'react';
import StationTable from './components/StationTable';
import AirQualityTable from './components/AirQualityTable';

function App() {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1> Система Екологічного Моніторингу (React + Express + MongoDB)</h1>
      </header>
      <main>
        <StationTable />
        <hr style={{ margin: '40px 0' }} />
        <AirQualityTable />
      </main>
    </div>
  );
}

export default App;