import React from 'react';
import DoctorManager from '../components/DoctorManager';
import AppointmentForm from '../components/AppointmentForm';
import AppointmentList from '../components/AppointmentList';
import useDoctors from '../hooks/useDoctors';
import useAppointments from '../hooks/useAppointments';

const AdminPage = () => {
  const { doctors, reload: reloadDoctors } = useDoctors();
  const { appointments, error, reload, updateStatus, remove } = useAppointments('');

  return (
    <main className="container">
      <div className="stack">
        <DoctorManager doctors={doctors} onChange={reloadDoctors} />
        <AppointmentForm
          title="Book on Behalf of Patient"
          doctors={doctors}
          onAppointmentCreated={reload}
        />
      </div>
      <div className="stack">
        {error && <p className="error-text">{error}</p>}
        <AppointmentList
          title="All Appointments"
          appointments={appointments}
          onStatusUpdate={updateStatus}
          onDelete={remove}
        />
      </div>
    </main>
  );
};

export default AdminPage;
