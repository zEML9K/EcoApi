import React, { useState, useEffect } from 'react';
import API from '../services/api';
import DataTable from './DataTable';

const SOURCES = ['manual', 'SaveEcoBot', 'OpenAQ', 'data.gov.ua'];
const emptyForm = { station: '', pm25: '', pm10: '', source: 'manual' };

const columns = [
  { header: 'Станція', render: (m) => m.station?.name || '—' },
  { header: 'Місто', render: (m) => m.station?.city || '—' },
  {
    header: 'PM2.5 (мкг/м³)',
    render: (m) => <span className={m.pm25 > 35 ? 'pm-bad' : 'pm-good'}>{m.pm25}</span>
  },
  { header: 'PM10 (мкг/м³)', render: (m) => m.pm10 ?? '—' },
  { header: 'Джерело', render: (m) => m.source },
  { header: 'Час вимірювання', render: (m) => new Date(m.measured_at).toLocaleString('uk-UA') }
];

function AirQualityTable() {
  const [measurements, setMeasurements] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);

  const errorText = (err) => err.response?.data?.error || err.message;

  const fetchData = async () => {
    try {
      const [mRes, sRes] = await Promise.all([
        API.get('/air-quality'),
        API.get('/stations')
      ]);
      setMeasurements(mRes.data.data);
      setStations(sRes.data.data);
      setError(null);
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      station: formData.station,
      pm25: parseFloat(formData.pm25),
      pm10: formData.pm10 === '' ? null : parseFloat(formData.pm10),
      source: formData.source
    };
    try {
      if (editingId) {
        await API.put(`/air-quality/${editingId}`, payload);
      } else {
        await API.post('/air-quality', payload);
      }
      resetForm();
      fetchData();
    } catch (err) {
      alert('Помилка збереження: ' + errorText(err));
    }
  };

  const handleEdit = (m) => {
    setEditingId(m._id);
    setFormData({
      station: m.station?._id || '',
      pm25: String(m.pm25),
      pm10: m.pm10 != null ? String(m.pm10) : '',
      source: m.source
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Видалити це вимірювання?')) return;
    try {
      await API.delete(`/air-quality/${id}`);
      if (id === editingId) resetForm();
      fetchData();
    } catch (err) {
      alert('Помилка видалення: ' + errorText(err));
    }
  };

  if (loading) return <div className="state-message">Завантаження показників якості повітря...</div>;

  return (
    <section className="section">
      <h2 className="section-title">Показники якості повітря</h2>

      {error && <div className="state-message state-error banner">Помилка: {error}</div>}

      <form onSubmit={handleSubmit} className="form-row">
        <select className="input" name="station" value={formData.station}
          onChange={handleChange} required>
          <option value="">Оберіть станцію</option>
          {stations.map((st) => (
            <option key={st._id} value={st._id}>{st.name} ({st.city})</option>
          ))}
        </select>
        <input className="input" type="number" step="any" min="0" name="pm25"
          placeholder="PM2.5" value={formData.pm25} onChange={handleChange} required />
        <input className="input" type="number" step="any" min="0" name="pm10"
          placeholder="PM10 (необов'язково)" value={formData.pm10} onChange={handleChange} />
        <select className="input" name="source" value={formData.source} onChange={handleChange}>
          {SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

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
        data={measurements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        emptyText="Вимірювань поки немає"
      />
    </section>
  );
}

export default AirQualityTable;