import React, { useState } from 'react';
import AppointmentList from '../components/AppointmentList';
import useDoctors from '../hooks/useDoctors';
import useAppointments from '../hooks/useAppointments';

const STORAGE_KEY = 'clinic.selectedDoctor';

const readStoredDoctor = () => {
  try {
    return localStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return '';
  }
};

const DoctorPage = () => {
  const { doctors } = useDoctors();
  const [doctorId, setDoctorId] = useState(readStoredDoctor);
  const { appointments, error, updateStatus } = useAppointments(
    doctorId ? `?doctor=${doctorId}` : null
  );

  const handleSelect = (e) => {
    const id = e.target.value;
    setDoctorId(id);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      // storage unavailable; the selection just won't persist
    }
  };

  const selected = doctors.find((d) => d._id === doctorId);
  const count = (status) => appointments.filter((a) => a.status === status).length;

  return (
    <main className="container single">
      <div className="card">
        <h2>Doctor Dashboard</h2>
        <div className="form-group">
          <label>I am</label>
          <select value={doctorId} onChange={handleSelect}>
            <option value="">Select your name</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name} ({doc.specialization})
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <div className="stats">
            <div className="stat">
              <strong>{count('Booked')}</strong>
              <span>Booked</span>
            </div>
            <div className="stat">
              <strong>{count('Completed')}</strong>
              <span>Completed</span>
            </div>
            <div className="stat">
              <strong>{count('Cancelled')}</strong>
              <span>Cancelled</span>
            </div>
          </div>
        )}
      </div>

      {error && <p className="error-text">{error}</p>}
      {selected ? (
        <AppointmentList
          title={`Appointments for Dr. ${selected.name}`}
          emptyText="No appointments for this doctor yet."
          appointments={appointments}
          onStatusUpdate={updateStatus}
          showDelete={false}
        />
      ) : (
        <div className="card">
          <p className="muted">Choose a doctor above to see their appointments.</p>
        </div>
      )}
    </main>
  );
};

export default DoctorPage;
