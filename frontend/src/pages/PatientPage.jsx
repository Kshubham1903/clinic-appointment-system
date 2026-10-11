import React, { useState } from 'react';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import useDoctors from '../hooks/useDoctors';
import useAppointments from '../hooks/useAppointments';

const PatientPage = () => {
  const { doctors } = useDoctors();
  const [email, setEmail] = useState('');
  const [query, setQuery] = useState(null);
  const { appointments, error, reload, updateStatus } = useAppointments(query);

  const lookup = (address) => {
    const next = `?email=${encodeURIComponent(address.trim())}`;
    if (next === query) reload();
    else setQuery(next);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    lookup(email);
  };

  // After booking, show that patient's appointments straight away.
  const handleCreated = (appointment) => {
    setEmail(appointment.patientEmail);
    lookup(appointment.patientEmail);
  };

  return (
    <main className="container">
      <AppointmentForm doctors={doctors} onAppointmentCreated={handleCreated} />

      <div className="stack">
        <div className="card">
          <h2>My Appointments</h2>
          <form className="inline-form" onSubmit={handleSearch}>
            <input
              type="email"
              placeholder="Enter the email you booked with"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="submit-btn">
              Search
            </button>
          </form>
        </div>

        {error && <p className="error-text">{error}</p>}
        {query !== null && (
          <AppointmentList
            title="Your Bookings"
            emptyText="No appointments found for this email."
            appointments={appointments}
            onStatusUpdate={updateStatus}
            showComplete={false}
            showDelete={false}
          />
        )}
      </div>
    </main>
  );
};

export default PatientPage;
