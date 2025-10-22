import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DriverStats } from './components/DriverStats';
import { LapSimulation } from './components/LapSimulation';
import { RaceStrategyPlanner } from './components/CarModelViewer';
import { DriverSelector } from './components/DriverSelector';
import { useF1Data } from './hooks/useF1Data';
import type { Driver } from './types';
import { DRIVERS } from './constants';

export type View = 'stats' | 'simulation' | 'strategy';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('stats');
  const [selectedDrivers, setSelectedDrivers] = useState<Driver[]>([DRIVERS[0], DRIVERS[1]]);

  const { data, loading, error } = useF1Data(selectedDrivers);

  const handleDriverSelect = (driver: Driver, index: number) => {
    setSelectedDrivers(prev => {
      const newSelection = [...prev];
      newSelection[index] = driver;
      // Ensure two different drivers are selected if possible
      if (newSelection[0].id === newSelection[1].id) {
          const differentDriver = DRIVERS.find(d => d.id !== driver.id);
          if (differentDriver) {
             newSelection[index === 0 ? 1: 0] = differentDriver;
          }
      }
      return newSelection;
    });
  };

  const MemoizedDriverStats = useMemo(() => <DriverStats data={data} loading={loading} error={error} />, [data, loading, error]);
  const MemoizedLapSimulation = useMemo(() => <LapSimulation data={data} loading={loading} error={error} />, [data, loading, error]);
  const MemoizedStrategyPlanner = useMemo(() => <RaceStrategyPlanner data={data} loading={loading} error={error} />, [data, loading, error]);

  const renderContent = () => {
    switch (activeView) {
      case 'stats':
        return MemoizedDriverStats;
      case 'simulation':
        return MemoizedLapSimulation;
      case 'strategy':
        return MemoizedStrategyPlanner;
      default:
        return MemoizedDriverStats;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black font-sans">
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-800/50 rounded-xl shadow-2xl p-6 backdrop-blur-sm border border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-4 tracking-wider uppercase">Controls</h2>
            <DriverSelector
              selectedDrivers={selectedDrivers}
              onDriverSelect={handleDriverSelect}
            />
          </div>
          <div className="mt-8">
            {renderContent()}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;