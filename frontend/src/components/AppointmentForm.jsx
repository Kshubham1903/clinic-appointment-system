import React, { useState, useEffect } from 'react';
import { request, TIME_SLOTS } from '../api';

const emptyForm = {
  patientName: '',
  patientEmail: '',
  patientPhone: '',
  doctor: '',
  appointmentDate: '',
  timeSlot: TIME_SLOTS[0],
  symptoms: '',
};

const AppointmentForm = ({ doctors, onAppointmentCreated, title = 'Book Appointment' }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { doctor, appointmentDate } = formData;

  // Load the slots already taken for the chosen doctor and date.
  useEffect(() => {
    if (!doctor || !appointmentDate) {
      setBookedSlots([]);
      return;
    }
    let cancelled = false;
    request(`/appointments/slots?doctor=${doctor}&date=${appointmentDate}`)
      .then((res) => !cancelled && setBookedSlots(res.data))
      .catch(() => !cancelled && setBookedSlots([]));
    return () => {
      cancelled = true;
    };
  }, [doctor, appointmentDate]);

  // Move off a slot that has just become unavailable.
  useEffect(() => {
    if (bookedSlots.includes(formData.timeSlot)) {
      const free = TIME_SLOTS.find((s) => !bookedSlots.includes(s));
      setFormData((f) => ({ ...f, timeSlot: free || '' }));
    }
  }, [bookedSlots, formData.timeSlot]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await request('/appointments', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      onAppointmentCreated(data.data);
      setFormData(emptyForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2>{title}</h2>
      {error && <p className="error-text">{error}</p>}
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
            <option value="">
              {doctors.length === 0 ? 'No doctors available yet' : 'Select Doctor'}
            </option>
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
          <select name="timeSlot" value={formData.timeSlot} onChange={handleChange} required>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                {slot}
                {bookedSlots.includes(slot) ? ' (booked)' : ''}
              </option>
            ))}
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

        <button type="submit" className="submit-btn" disabled={loading || !formData.timeSlot}>
          {loading ? 'Processing...' : 'Confirm Appointment'}
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
