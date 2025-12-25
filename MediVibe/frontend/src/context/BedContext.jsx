import React, { createContext, useContext, useState, useCallback } from 'react';
import { bedService } from '../services';

const BedContext = createContext();

export const BedProvider = ({ children }) => {
  const [beds, setBeds] = useState([]);
  const [bedStats, setBedStats] = useState({
    totalBeds: 0,
    availableBeds: 0,
    occupiedBeds: 0,
    maintenanceBeds: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchAllBeds = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bedService.getAllBeds();
      setBeds(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching beds:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBedAvailability = useCallback(async () => {
    try {
      const response = await bedService.getBedAvailability();
      const data = response.data?.data;
      setBedStats({
        totalBeds: data?.totals?.totalBeds || 0,
        availableBeds: data?.totals?.availableBeds || 0,
        occupiedBeds: data?.totals?.occupiedBeds || 0,
        maintenanceBeds: data?.totals?.maintenanceBeds || 0,
        cleaningBeds: data?.totals?.cleaningBeds || 0,
      });
    } catch (error) {
      console.error('Error fetching bed availability:', error);
    }
  }, []);

  const updateBedStatus = useCallback(async (bedId, status) => {
    try {
      await bedService.updateBedStatus(bedId, status);
      await fetchAllBeds();
      await fetchBedAvailability();
      return { success: true };
    } catch (error) {
      return { success: false, error: error.response?.data?.message };
    }
  }, [fetchAllBeds, fetchBedAvailability]);

  const value = {
    beds,
    bedStats,
    loading,
    fetchAllBeds,
    fetchBedAvailability,
    updateBedStatus,
  };

  return (
    <BedContext.Provider value={value}>
      {children}
    </BedContext.Provider>
  );
};

export const useBeds = () => {
  const context = useContext(BedContext);
  if (!context) {
    throw new Error('useBeds must be used within BedProvider');
  }
  return context;
};
