import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DataTable from './DataTable';

const emptyForm = { name: '', city: '', latitude: '', longitude: '', active: true };

const columns = [
  { header: 'Назва', render: (st) => st.name },
  { header: 'Місто', render: (st) => st.city },
  { header: 'Координати', render: (st) => `${st.latitude}, ${st.longitude}` },
  {
    header: 'Статус',
    render: (st) => (
      <span className={`badge ${st.active ? 'badge-on' : 'badge-off'}`}>
        {st.active ? '🟢 Активна' : '🔴 Неактивна'}
      </span>
    )
  }
];

function StationTable() {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const errorText = (err) => err.response?.data?.error || err.message;

  const fetchStations = async () => {
    try {
      const res = await API.get('/stations');
      setStations(res.data.data);
      setError(null);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      latitude: parseFloat(formData.latitude),
      longitude: parseFloat(formData.longitude)
    };
    try {
      if (editingId) {
        await API.put(`/stations/${editingId}`, payload);
      } else {
        await API.post('/stations', payload);
      }
      resetForm();
      fetchStations();
    } catch (err) {
      alert('Помилка збереження: ' + errorText(err));
    }
  };

  const handleEdit = (st) => {
    setEditingId(st._id);
    setFormData({
      name: st.name,
      city: st.city,
      latitude: String(st.latitude),
      longitude: String(st.longitude),
      active: st.active
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Ви впевнені, що хочете видалити цю станцію?')) return;
    try {
      await API.delete(`/stations/${id}`);
      if (id === editingId) resetForm();
      fetchStations();
    } catch (err) {
      alert('Помилка видалення: ' + errorText(err));
    }
  };

  if (loading) return <div className="state-message">Завантаження станцій...</div>;

  return (
    <section className="section">
      <h2 className="section-title">Станції екологічного моніторингу</h2>

      {error && <div className="state-message state-error banner">Помилка: {error}</div>}

      <form onSubmit={handleSubmit} className="form-row">
        <input className="input" type="text" name="name" placeholder="Назва станції"
          value={formData.name} onChange={handleChange} required />
        <input className="input" type="text" name="city" placeholder="Місто"
          value={formData.city} onChange={handleChange} required />
        <input className="input" type="number" step="any" name="latitude"
          placeholder="Широта (-90 до 90)" value={formData.latitude}
          onChange={handleChange} required />
        <input className="input" type="number" step="any" name="longitude"
          placeholder="Довгота (-180 до 180)" value={formData.longitude}
          onChange={handleChange} required />

        {editingId && (
          <label className="checkbox">
            <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} />
            Активна
          </label>
        )}

        <button type="submit" className="btn btn-primary">
          {editingId ? 'Зберегти' : 'Додати'}
        </button>
        {editingId && (
          <button type="button" className="btn btn-secondary" onClick={resetForm}>
            Скасувати
          </button>
        )}
      </form>

      <DataTable
        columns={columns}
        data={stations}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyText="Станцій поки немає"
      />
    </section>
  );
}

export default StationTable;