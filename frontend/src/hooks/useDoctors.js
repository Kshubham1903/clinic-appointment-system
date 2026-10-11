import { useState, useEffect, useCallback } from 'react';
import { request } from '../api';

export default function useDoctors() {
  const [doctors, setDoctors] = useState([]);

  const reload = useCallback(async () => {
    try {
      const res = await request('/doctors');
      setDoctors(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return { doctors, reload };
}
