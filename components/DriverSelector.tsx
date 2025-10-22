
import React from 'react';
import type { Driver } from '../types';
import { DRIVERS } from '../constants';

interface DriverSelectorProps {
  selectedDrivers: Driver[];
  onDriverSelect: (driver: Driver, index: number) => void;
}

const SingleDriverSelector: React.FC<{
  selectedDriver: Driver;
  onSelect: (driver: Driver) => void;
  label: string;
  borderColor: string;
}> = ({ selectedDriver, onSelect, label, borderColor }) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const driverId = e.target.value;
    const driver = DRIVERS.find(d => d.id === driverId);
    if (driver) {
      onSelect(driver);
    }
  };

  return (
    <div className="flex-1">
      <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
      <select
        value={selectedDriver.id}
        onChange={handleSelectChange}
        className={`w-full bg-gray-700 text-white rounded-md p-2 border-2 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all`}
        style={{ borderColor: borderColor, outlineColor: borderColor }}
      >
        {DRIVERS.map(driver => (
          <option key={driver.id} value={driver.id}>
            {driver.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export const DriverSelector: React.FC<DriverSelectorProps> = ({ selectedDrivers, onDriverSelect }) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <SingleDriverSelector
        label="Driver 1"
        selectedDriver={selectedDrivers[0]}
        onSelect={(driver) => onDriverSelect(driver, 0)}
        borderColor={selectedDrivers[0]?.color || '#ffffff'}
      />
      <SingleDriverSelector
        label="Driver 2"
        selectedDriver={selectedDrivers[1]}
        onSelect={(driver) => onDriverSelect(driver, 1)}
        borderColor={selectedDrivers[1]?.color || '#ffffff'}
      />
    </div>
  );
};
