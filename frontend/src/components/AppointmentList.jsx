import React from 'react';

const AppointmentList = ({
  appointments,
  onStatusUpdate,
  onDelete,
  title = 'Scheduled Appointments',
  emptyText = 'No appointments scheduled yet.',
  showComplete = true,
  showCancel = true,
  showDelete = true,
}) => {
  const hasActions = showComplete || showCancel || showDelete;

  return (
    <div className="card">
      <h2>{title}</h2>
      {appointments.length === 0 ? (
        <p style={{ color: '#6c757d', fontSize: '0.9rem' }}>{emptyText}</p>
      ) : (
        <table className="appointment-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Slot</th>
              <th>Status</th>
              {hasActions && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => (
              <tr key={item._id}>
                <td>
                  <strong>{item.patientName}</strong>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.patientPhone}</div>
                  {item.symptoms && (
                    <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.symptoms}</div>
                  )}
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
                  <div>
                    {new Date(item.appointmentDate).toLocaleDateString(undefined, {
                      timeZone: 'UTC',
                    })}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#6c757d' }}>{item.timeSlot}</div>
                </td>
                <td>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </td>
                {hasActions && (
                  <td>
                    {showComplete && item.status === 'Booked' && (
                      <button
                        className="action-btn"
                        onClick={() => onStatusUpdate(item._id, 'Completed')}
                      >
                        Complete
                      </button>
                    )}
                    {showCancel && item.status === 'Booked' && (
                      <button
                        className="action-btn"
                        onClick={() => onStatusUpdate(item._id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    )}
                    {showDelete && (
                      <button className="action-btn delete" onClick={() => onDelete(item._id)}>
                        Remove
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AppointmentList;
