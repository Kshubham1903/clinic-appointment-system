import React, { useState } from 'react';

const AppointmentForm = ({ doctors, onAppointmentCreated }) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    doctor: '',
    appointmentDate: '',
    timeSlot: '09:00 AM - 10:00 AM',
    symptoms: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      onAppointmentCreated(data.data);
      setFormData({
        patientName: '',
        patientEmail: '',
        patientPhone: '',
        doctor: '',
        appointmentDate: '',
        timeSlot: '09:00 AM - 10:00 AM',
        symptoms: '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>Book Appointment</h2>
      {error && <p style={{ color: '#dc3545', marginBottom: '12px', fontSize: '0.85rem' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Full Name</label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="patientEmail"
            value={formData.patientEmail}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            type="tel"
            name="patientPhone"
            value={formData.patientPhone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Consulting Doctor</label>
          <select name="doctor" value={formData.doctor} onChange={handleChange} required>
            <option value="">Select Doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name} ({doc.specialization}) - ₹{doc.consultationFee}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Preferred Date</label>
          <input
            type="date"
            name="appointmentDate"
            value={formData.appointmentDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Time Slot</label>
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange}>
            <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
            <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
            <option value="11:00 AM - 12:00 PM">11:00 AM - 12:00 PM</option>
            <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
            <option value="03:00 PM - 04:00 PM">03:00 PM - 04:00 PM</option>
          </select>
        </div>

        <div className="form-group">
          <label>Symptoms / Reason</label>
          <textarea
            name="symptoms"
            rows="3"
            value={formData.symptoms}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Processing...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
