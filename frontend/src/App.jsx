import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AppointmentForm from './components/AppointmentForm';
import AppointmentList from './components/AppointmentList';
import { API_BASE } from './api';
import './App.css';

function App() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await fetch(`${API_BASE}/doctors`);
      const data = await res.json();
      if (data.success) {
        setDoctors(data.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await fetch(`${API_BASE}/appointments`);
      const data = await res.json();
      if (data.success) {
        setAppointments(data.data);
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
    }
  };

  const handleAppointmentCreated = (newAppointment) => {
    setAppointments([newAppointment, ...appointments]);
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setAppointments(appointments.map((a) => (a._id === id ? data.data : a)));
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to remove this appointment?')) return;
    try {
      const res = await fetch(`${API_BASE}/appointments/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAppointments(appointments.filter((a) => a._id !== id));
      }
    } catch (err) {
      console.error('Error deleting appointment:', err);
    }
  };

  return (
    <div>
      <Navbar />
      <main className="container">
        <AppointmentForm doctors={doctors} onAppointmentCreated={handleAppointmentCreated} />
        <AppointmentList
          appointments={appointments}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDelete}
        />
      </main>
    </div>
  );
}

export default App;
