import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { F1Data } from '../types';
import { LoadingSpinner } from './icons';

interface DriverStatsProps {
    data: F1Data | null;
    loading: boolean;
    error: string | null;
}

const StatComparisonRow: React.FC<{
  statName: string;
  value1: number | string;
  value2: number | string;
  color1: string;
  color2: string;
}> = ({ statName, value1, value2, color1, color2 }) => {
  const numericValue1 = Number(value1);
  const numericValue2 = Number(value2);
  const isValue1Greater = !isNaN(numericValue1) && !isNaN(numericValue2) && numericValue1 > numericValue2;
  const isValue2Greater = !isNaN(numericValue1) && !isNaN(numericValue2) && numericValue2 > numericValue1;

  return (
    <div className="flex items-center justify-between text-lg py-3 border-b border-gray-700/50 last:border-b-0">
      <span 
        className={`font-bold w-1/4 text-left transition-colors duration-300 ${isValue1Greater ? 'text-white' : 'text-gray-400'}`} 
        style={{ color: isValue1Greater ? color1 : '' }}
      >
        {value1}
      </span>
      <span className="w-1/2 text-center text-gray-300 uppercase tracking-wider text-sm font-semibold">{statName}</span>
      <span 
        className={`font-bold w-1/4 text-right transition-colors duration-300 ${isValue2Greater ? 'text-white' : 'text-gray-400'}`} 
        style={{ color: isValue2Greater ? color2 : '' }}
      >
        {value2}
      </span>
    </div>
  );
};


export const DriverStats: React.FC<DriverStatsProps> = ({ data, loading, error }) => {
    if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data) return <p className="text-center">No data available.</p>;

    const { driver1, driver2 } = data;

    const comparisonData = [
        { name: 'Wins', [driver1.driver.name]: driver1.stats.wins, [driver2.driver.name]: driver2.stats.wins },
        { name: 'Podiums', [driver1.driver.name]: driver1.stats.podiums, [driver2.driver.name]: driver2.stats.podiums },
        { name: 'Poles', [driver1.driver.name]: driver1.stats.poles, [driver2.driver.name]: driver2.stats.poles },
        { name: 'Championships', [driver1.driver.name]: driver1.stats.championships, [driver2.driver.name]: driver2.stats.championships },
    ];
    
    return (
        <div className="space-y-8">
             <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                    <div className="text-left flex-1">
                        <h3 className="text-xl font-bold truncate" style={{color: driver1.driver.color}}>{driver1.driver.name}</h3>
                        <p className="text-sm text-gray-400">{driver1.driver.team}</p>
                    </div>
                    <span className="text-red-500 font-black text-2xl px-4">VS</span>
                    <div className="text-right flex-1">
                        <h3 className="text-xl font-bold truncate" style={{color: driver2.driver.color}}>{driver2.driver.name}</h3>
                        <p className="text-sm text-gray-400">{driver2.driver.team}</p>
                    </div>
                </div>
                <div className="space-y-1">
                    <StatComparisonRow statName="Wins" value1={driver1.stats.wins} value2={driver2.stats.wins} color1={driver1.driver.color} color2={driver2.driver.color} />
                    <StatComparisonRow statName="Podiums" value1={driver1.stats.podiums} value2={driver2.stats.podiums} color1={driver1.driver.color} color2={driver2.driver.color} />
                    <StatComparisonRow statName="Poles" value1={driver1.stats.poles} value2={driver2.stats.poles} color1={driver1.driver.color} color2={driver2.driver.color} />
                    <StatComparisonRow statName="Championships" value1={driver1.stats.championships} value2={driver2.stats.championships} color1={driver1.driver.color} color2={driver2.driver.color} />
                    <StatComparisonRow statName="Races" value1={driver1.stats.races} value2={driver2.stats.races} color1={driver1.driver.color} color2={driver2.driver.color} />
                </div>
            </div>

            <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
                 <h3 className="text-xl font-bold mb-4 text-center text-gray-200">Career Comparison Chart</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" tick={{ fill: '#A0AEC0' }} />
                        <YAxis tick={{ fill: '#A0AEC0' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }} />
                        <Legend wrapperStyle={{ color: '#E2E8F0' }} />
                        <Bar dataKey={driver1.driver.name} fill={driver1.driver.color} />
                        <Bar dataKey={driver2.driver.name} fill={driver2.driver.color} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};