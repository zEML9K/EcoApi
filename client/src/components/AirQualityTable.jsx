import React, { useState, useEffect } from 'react';
import API from '../services/api';

function AirQualityTable() {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get('/air-quality')
      .then((res) => setMeasurements(res.data.data))
      .catch((err) => console.error('Помилка завантаження вимірювань:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Завантаження показників якості повітря...</div>;

  return (
    <div>
      <h2>💨 Показники якості повітря (Air Quality)</h2>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Станція</th>
            <th>Місто</th>
            <th>PM2.5 (мкг/м³)</th>
            <th>PM10 (мкг/м³)</th>
            <th>Джерело</th>
            <th>Час вимірювання</th>
          </tr>
        </thead>
        <tbody>
          {measurements.map((m) => (
            <tr key={m._id}>
              <td>{m.station?.name || '—'}</td>
              <td>{m.station?.city || '—'}</td>
              <td style={{ color: m.pm25 > 35 ? 'red' : 'green', fontWeight: 'bold' }}>
                {m.pm25}
              </td>
              <td>{m.pm10 ?? '—'}</td>
              <td>{m.source}</td>
              <td>{new Date(m.measured_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AirQualityTable;