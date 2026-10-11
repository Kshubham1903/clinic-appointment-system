import React from 'react';

const AppointmentList = ({ appointments, onStatusUpdate, onDelete }) => {
  return (
    <div className="card">
      <h2>Scheduled Appointments</h2>
      {appointments.length === 0 ? (
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>No appointments scheduled yet.</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Slot</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.patientName}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.patientPhone}</div>
                </td>
                <td>
                  {item.doctor ? (
                    <>
                      <div>Dr. {item.doctor.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>
                        {item.doctor.specialization}
                      </div>
                    </>
                  ) : (
                    'Not Assigned'
                  )}
                </td>
                <td>
                  <div>{new Date(item.appointmentDate).toLocaleDateString()}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.timeSlot}</div>
                </td>
                <td>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </td>
                <td>
                  {item.status !== 'Completed' && (
                    <button
                      className="action-btn"
                      onClick={() => onStatusUpdate(item._id, 'Completed')}
                    >
                      Complete
                    </button>
                  )}
                  {item.status !== 'Cancelled' && (
                    <button
                      className="action-btn"
                      onClick={() => onStatusUpdate(item._id, 'Cancelled')}
                    >
                      Cancel
                    </button>
                  )}
                  <button className="action-btn delete" onClick={() => onDelete(item._id)}>
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
