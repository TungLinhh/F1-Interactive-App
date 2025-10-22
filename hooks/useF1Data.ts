
import { useState, useEffect } from 'react';
import { generateF1Data } from '../services/geminiService';
import type { Driver, F1Data } from '../types';

export const useF1Data = (selectedDrivers: Driver[]) => {
  const [data, setData] = useState<F1Data | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDrivers.length < 2 || !selectedDrivers[0] || !selectedDrivers[1]) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const result = await generateF1Data(selectedDrivers[0], selectedDrivers[1]);
        setData(result);
      } catch (err) {
        setError('Failed to fetch F1 data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedDrivers]);

  return { data, loading, error };
};
