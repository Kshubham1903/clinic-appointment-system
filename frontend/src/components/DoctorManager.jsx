import React, { useState } from 'react';
import { request, WEEKDAYS } from '../api';

const emptyDoctor = {
  name: '',
  specialization: '',
  consultationFee: '',
  availableDays: WEEKDAYS.slice(0, 5),
};

const DoctorManager = ({ doctors, onChange }) => {
  const [form, setForm] = useState(emptyDoctor);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleDay = (day) => {
    setForm((f) => ({
      ...f,
      availableDays: f.availableDays.includes(day)
        ? f.availableDays.filter((d) => d !== day)
        : [...f.availableDays, day],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await request('/doctors', {
        method: 'POST',
        body: JSON.stringify({ ...form, consultationFee: Number(form.consultationFee) }),
      });
      setForm(emptyDoctor);
      onChange();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Remove Dr. ${doc.name}?`)) return;
    setError('');
    try {
      await request(`/doctors/${doc._id}`, { method: 'DELETE' });
      onChange();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="card">
      <h2>Manage Doctors</h2>
      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Doctor Name</label>
          <input name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Specialization</label>
          <input
            name="specialization"
            value={form.specialization}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Consultation Fee (₹)</label>
          <input
            type="number"
            min="0"
            name="consultationFee"
            value={form.consultationFee}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Available Days</label>
          <div className="day-picker">
            {WEEKDAYS.map((day) => (
              <label key={day} className="day-option">
                <input
                  type="checkbox"
                  checked={form.availableDays.includes(day)}
                  onChange={() => toggleDay(day)}
                />
                {day.slice(0, 3)}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Saving...' : 'Add Doctor'}
        </button>
      </form>

      <h3 className="sub-heading">Current Doctors ({doctors.length})</h3>
      {doctors.length === 0 ? (
        <p className="muted">No doctors added yet.</p>
      ) : (
        <ul className="doctor-list">
          {doctors.map((doc) => (
            <li key={doc._id}>
              <div>
                <strong>Dr. {doc.name}</strong>
                <div className="muted">
                  {doc.specialization} · ₹{doc.consultationFee}
                </div>
                <div className="muted">{doc.availableDays.map((d) => d.slice(0, 3)).join(', ')}</div>
              </div>
              <button className="action-btn delete" onClick={() => handleDelete(doc)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorManager;
