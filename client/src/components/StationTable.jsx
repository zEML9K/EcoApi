import React, { useState, useEffect } from 'react';
import API from '../services/api';

function StationTable() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    latitude: '',
    longitude: ''
  });

  // Функція завантаження станцій з API (використовує useEffect)
  const fetchStations = async () => {
    try {
      setLoading(true);
      const res = await API.get('/stations');
      setStations(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/stations', {
        ...formData,
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude)
      });
      setFormData({ name: '', city: '', latitude: '', longitude: '' });
      fetchStations(); 
    } catch (err) {
      alert('Помилка створення: ' + (err.response?.data?.error || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю станцію?')) return;
    try {
      await API.delete(`/stations/${id}`);
      fetchStations();
    } catch (err) {
      alert('Помилка видалення: ' + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Завантаження станцій...</div>;
  if (error) return <div style={{ color: 'red' }}>Помилка: {error}</div>;

  return (
    <div style={{ marginBottom: '40px' }}>
      <h2>📍 Станції екологічного моніторингу (Stations)</h2>

      {/* Форма для додавання (CREATE) */}
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Назва станції"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Місто"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Широта (-90 до 90)"
          value={formData.latitude}
          onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
          required
        />
        <input
          type="number"
          step="any"
          placeholder="Довгота (-180 до 180)"
          value={formData.longitude}
          onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
          required
        />
        <button type="submit" style={{ background: '#2e7d32', color: '#fff', border: 'none', padding: '8px 15px', cursor: 'pointer' }}>
          Додати
        </button>
      </form>

      {/* Таблиця виведення даних (READ) */}
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f4f4f4' }}>
            <th>Назва</th>
            <th>Місто</th>
            <th>Координати</th>
            <th>Статус</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {stations.map((st) => (
            <tr key={st._id}>
              <td>{st.name}</td>
              <td>{st.city}</td>
              <td>{st.latitude}, {st.longitude}</td>
              <td>{st.active ? '🟢 Активна' : '🔴 Неактивна'}</td>
              <td>
                <button 
                  onClick={() => handleDelete(st._id)} 
                  style={{ background: '#d32f2f', color: '#fff', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StationTable;