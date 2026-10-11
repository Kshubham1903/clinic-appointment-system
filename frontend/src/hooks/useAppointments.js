import { useState, useEffect, useCallback } from 'react';
import { request } from '../api';

// query: a query string such as '?doctor=<id>', '' for everything, or null to load nothing.
export default function useAppointments(query = '') {
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');

  const reload = useCallback(async () => {
    if (query === null) {
      setAppointments([]);
      return;
    }
    try {
      const res = await request(`/appointments${query}`);
      setAppointments(res.data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }, [query]);

  useEffect(() => {
    reload();
  }, [reload]);

  const updateStatus = async (id, status) => {
    try {
      const res = await request(`/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      setAppointments((list) => list.map((a) => (a._id === id ? res.data : a)));
    } catch (err) {
      setError(err.message);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to remove this appointment?')) return;
    try {
      await request(`/appointments/${id}`, { method: 'DELETE' });
      setAppointments((list) => list.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  return { appointments, error, reload, updateStatus, remove };
}
