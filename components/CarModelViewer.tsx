import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { F1Data, TireCompound, PitStop } from '../types';
import { TIRE_COMPOUNDS } from '../constants';
import { LoadingSpinner } from './icons';

interface RaceStrategyPlannerProps {
    data: F1Data | null;
    loading: boolean;
    error: string | null;
}

const RACE_LAPS = 50;

const calculateStrategyLaps = (baseLapTime: number, pitStops: PitStop[]) => {
    let lapTimes: { lap: number, time: number, tire: TireCompound }[] = [];
    let currentLap = 1;

    const fullStrategy = [...pitStops, { lap: RACE_LAPS + 1, tire: 'soft' }]; // Add final stop to calculate up to race end

    for (let i = 0; i < fullStrategy.length -1; i++) {
        const stintStartLap = fullStrategy[i].lap;
        const stintEndLap = fullStrategy[i+1].lap - 1;
        const tire = fullStrategy[i].tire;
        const compound = TIRE_COMPOUNDS[tire];
        
        let tireAge = 0;
        for (let lap = stintStartLap; lap <= stintEndLap; lap++) {
            const degradation = tireAge * compound.degradation;
            const lapTime = baseLapTime + compound.baseModifier + degradation;
            lapTimes.push({ lap, time: lapTime, tire });
            tireAge++;
        }
    }
    
    return lapTimes;
};


const StrategyEditor: React.FC<{
    driverName: string;
    color: string;
    pitStops: PitStop[];
    setPitStops: React.Dispatch<React.SetStateAction<PitStop[]>>;
}> = ({ driverName, color, pitStops, setPitStops }) => {

    const addPitStop = () => {
        const lastLap = pitStops.length > 0 ? pitStops[pitStops.length-1].lap : 1;
        const newLap = Math.min(RACE_LAPS, lastLap + 10);
        if (pitStops.find(p => p.lap === newLap)) return; // Avoid duplicate laps
        setPitStops([...pitStops, { lap: newLap, tire: 'medium' }].sort((a,b) => a.lap - b.lap));
    };

    // FIX: Changed `newTire` type to handle string from select onChange
    const updatePitStop = (index: number, newLap: number, newTire: string) => {
        // Prevent changing first stop lap from 1
        const correctedLap = index === 0 ? 1 : Math.max(2, Math.min(RACE_LAPS, newLap));
        const newStops = [...pitStops];
        // Cast to TireCompound here to ensure state is always updated with the correct type.
        newStops[index] = { lap: correctedLap, tire: newTire as TireCompound };
        setPitStops(newStops.sort((a,b) => a.lap - b.lap));
    };

    const removePitStop = (index: number) => {
        if (index === 0) return; // Cannot remove starting tire
        setPitStops(pitStops.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 rounded-lg bg-gray-900/50 space-y-3" style={{ border: `1px solid ${color}` }}>
            <h4 className="font-bold text-lg" style={{ color: color }}>{driverName}'s Strategy</h4>
            {pitStops.map((stop, index) => (
                <div key={index} className="flex items-center gap-2">
                    <span className="font-semibold text-gray-300 w-12">{index === 0 ? "Start" : "Pit"}:</span>
                    <label className="text-sm text-gray-400">L</label>
                    <input 
                        type="number"
                        value={stop.lap}
                        onChange={e => updatePitStop(index, parseInt(e.target.value), stop.tire)}
                        disabled={index === 0}
                        className="w-16 bg-gray-700 text-white rounded p-1 text-center disabled:opacity-50"
                    />
                    <select
                        value={stop.tire}
                        onChange={e => updatePitStop(index, stop.lap, e.target.value)}
                        className="bg-gray-700 text-white rounded p-1"
                    >
                        {Object.entries(TIRE_COMPOUNDS).map(([key, {name}]) => <option key={key} value={key}>{name}</option>)}
                    </select>
                     {index > 0 && <button onClick={() => removePitStop(index)} className="text-red-500 hover:text-red-400">✕</button>}
                </div>
            ))}
            <button onClick={addPitStop} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-3 text-sm rounded transition-colors w-full">
                + Add Pit Stop
            </button>
        </div>
    );
};


export const RaceStrategyPlanner: React.FC<RaceStrategyPlannerProps> = ({ data, loading, error }) => {
    const [strategy1, setStrategy1] = useState<PitStop[]>([{ lap: 1, tire: 'medium' }]);
    const [strategy2, setStrategy2] = useState<PitStop[]>([{ lap: 1, tire: 'medium' }]);

    const chartData = useMemo(() => {
        if (!data) return [];
        const lapData1 = calculateStrategyLaps(data.driver1.lapData.lapTime, strategy1);
        const lapData2 = calculateStrategyLaps(data.driver2.lapData.lapTime, strategy2);
        
        let combined = [];
        for (let i = 0; i < RACE_LAPS; i++) {
            combined.push({
                lap: i + 1,
                [data.driver1.driver.name]: lapData1[i]?.time,
                tire1: lapData1[i]?.tire,
                [data.driver2.driver.name]: lapData2[i]?.time,
                tire2: lapData2[i]?.tire,
            });
        }
        return combined;
    }, [data, strategy1, strategy2]);

    if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data) return <p className="text-center">No data available.</p>;

    const { driver1, driver2 } = data;
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <h2 className="text-2xl font-bold text-red-500 mb-4 tracking-wider uppercase">Race Strategy Planner</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <StrategyEditor driverName={driver1.driver.name} color={driver1.driver.color} pitStops={strategy1} setPitStops={setStrategy1} />
                <StrategyEditor driverName={driver2.driver.name} color={driver2.driver.color} pitStops={strategy2} setPitStops={setStrategy2} />
            </div>

            <div>
                <h3 className="text-xl font-bold mb-4 text-center text-gray-200">Projected Lap Times</h3>
                <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="lap" label={{ value: 'Lap', position: 'insideBottomRight', offset: -5 }} tick={{ fill: '#A0AEC0' }} />
                        <YAxis label={{ value: 'Lap Time (s)', angle: -90, position: 'insideLeft' }} tick={{ fill: '#A0AEC0' }} domain={['dataMin - 1', 'dataMax + 1']} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#2D3748', border: '1px solid #4A5568' }}
                            formatter={(value, name, props) => [`${(value as number).toFixed(3)}s (Tire: ${props.payload.tire1})` , name]}
                        />
                        <Legend />
                        <Line type="monotone" dataKey={driver1.driver.name} stroke={driver1.driver.color} strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey={driver2.driver.name} stroke={driver2.driver.color} strokeWidth={2} dot={false} />
                        {strategy1.slice(1).map(stop => <ReferenceLine key={`p1-${stop.lap}`} x={stop.lap} stroke={driver1.driver.color} strokeDasharray="3 3" label={{ value: 'Pit', fill: driver1.driver.color, position: 'insideTop' }} />)}
                        {strategy2.slice(1).map(stop => <ReferenceLine key={`p2-${stop.lap}`} x={stop.lap} stroke={driver2.driver.color} strokeDasharray="3 3" label={{ value: 'Pit', fill: driver2.driver.color, position: 'insideBottom' }} />)}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};