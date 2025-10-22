import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { F1Data, F1DriverData, Track, TelemetryPoint } from '../types';
import { TRACKS } from '../constants';
import { LoadingSpinner } from './icons';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(3);
    return `${mins}:${secs.padStart(6, '0')}`;
};

const formatDelta = (delta: number) => {
    if (delta === 0) return "0.000";
    return `${delta > 0 ? '+' : ''}${delta.toFixed(3)}`;
};

const getTelemetryAtDistance = (telemetry: TelemetryPoint[], distance: number): TelemetryPoint => {
    const index = Math.min(telemetry.length - 1, Math.floor(distance * telemetry.length));
    return telemetry[index];
};

export const LapSimulation: React.FC<{ data: F1Data | null; loading: boolean; error: string | null; }> = ({ data, loading, error }) => {
    const [selectedTrack, setSelectedTrack] = useState<Track>(TRACKS[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    
    const trackPathRef = useRef<SVGPathElement>(null);
    const [pathLength, setPathLength] = useState(0);

    const animationFrameRef = useRef<number>();
    const lastTimeRef = useRef<number>();

    const driversStateRef = useRef([
        { distance: 0, lapTime: 0 },
        { distance: 0, lapTime: 0 },
    ]);
    const [, setTick] = useState(0); // Used to force re-render

    useEffect(() => {
        if (trackPathRef.current) {
            setPathLength(trackPathRef.current.getTotalLength());
        }
        // Reset simulation on track change
        driversStateRef.current = [{ distance: 0, lapTime: 0 }, { distance: 0, lapTime: 0 }];
        setIsPlaying(false);
        setTick(t => t + 1);
    }, [selectedTrack]);

    useEffect(() => {
        const animate = (timestamp: number) => {
            if (!lastTimeRef.current) {
                lastTimeRef.current = timestamp;
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }

            const deltaTime = (timestamp - lastTimeRef.current) / 1000; // in seconds
            lastTimeRef.current = timestamp;
            
            let allFinished = true;

            if (data) {
                driversStateRef.current = driversStateRef.current.map((driverState, index) => {
                    if (driverState.distance >= 1) {
                        return driverState;
                    }
                    allFinished = false;

                    const driverData = index === 0 ? data.driver1 : data.driver2;
                    const currentTelemetry = getTelemetryAtDistance(driverData.lapData.telemetry, driverState.distance);
                    const speedKmh = currentTelemetry.speed;
                    const speedMps = speedKmh * 1000 / 3600;
                    
                    const distanceIncrement = (speedMps / selectedTrack.length);
                    
                    return {
                        distance: Math.min(1, driverState.distance + distanceIncrement * deltaTime * 10), // a multiplier to speed up simulation
                        lapTime: driverState.lapTime + deltaTime,
                    };
                });
            }

            setTick(t => t + 1);
            
            if(allFinished) {
                setIsPlaying(false);
            } else {
                animationFrameRef.current = requestAnimationFrame(animate);
            }
        };

        if (isPlaying) {
            lastTimeRef.current = undefined;
            animationFrameRef.current = requestAnimationFrame(animate);
        } else {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        }

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [isPlaying, data, selectedTrack]);

    const handleReset = () => {
        setIsPlaying(false);
        driversStateRef.current = [{ distance: 0, lapTime: 0 }, { distance: 0, lapTime: 0 }];
        setTick(t => t + 1);
    };

    if (loading) return <div className="flex justify-center items-center h-96"><LoadingSpinner /></div>;
    if (error) return <p className="text-red-500 text-center">{error}</p>;
    if (!data) return <p className="text-center">No data available.</p>;

    const { driver1, driver2 } = data;
    const [driver1State, driver2State] = driversStateRef.current;
    
    const getPosition = (distance: number) => {
        if (!pathLength || !trackPathRef.current) return { x: 0, y: 0 };
        return trackPathRef.current.getPointAtLength(distance * pathLength);
    };

    const pos1 = getPosition(driver1State.distance);
    const pos2 = getPosition(driver2State.distance);
    
    const leadDriverData = driver1State.distance > driver2State.distance ? driver1 : driver2;
    const leadDriverProgress = Math.max(driver1State.distance, driver2State.distance);
    const timeDelta = driver1State.lapTime - driver2State.lapTime;

    const liveTelemetry = leadDriverData.lapData.telemetry.slice(0, Math.floor(leadDriverProgress * leadDriverData.lapData.telemetry.length));
    
    return (
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-red-500 tracking-wider uppercase">Lap Simulation</h2>
                <select 
                    value={selectedTrack.name} 
                    onChange={e => setSelectedTrack(TRACKS.find(t => t.name === e.target.value) || TRACKS[0])}
                    className="bg-gray-700 text-white rounded-md p-2 border-2 border-gray-600 focus:ring-2 focus:ring-red-500"
                >
                    {TRACKS.map(track => <option key={track.name} value={track.name}>{track.name}</option>)}
                </select>
            </div>
            
            <div className="aspect-video bg-gray-900 rounded-lg p-4 overflow-hidden flex justify-center items-center">
                <svg viewBox="0 0 900 600" className="w-full h-full">
                    <path ref={trackPathRef} d={selectedTrack.path} stroke="#4A5568" strokeWidth="8" fill="none" />
                    {pos1 && (
                        <g>
                            <circle cx={pos1.x} cy={pos1.y} r="8" fill={driver1.driver.color} stroke="white" strokeWidth="2" />
                            <text x={pos1.x + 12} y={pos1.y + 4} fill="white" fontSize="12" fontWeight="bold">{driver1.driver.abbreviation}</text>
                        </g>
                    )}
                    {pos2 && (
                        <g>
                            <circle cx={pos2.x} cy={pos2.y} r="8" fill={driver2.driver.color} stroke="white" strokeWidth="2" />
                            <text x={pos2.x + 12} y={pos2.y + 4} fill="white" fontSize="12" fontWeight="bold">{driver2.driver.abbreviation}</text>
                        </g>
                    )}
                </svg>
            </div>

            <div className="mt-4 flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors w-24">
                    {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition-colors">
                    Reset
                </button>
            </div>
            
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg bg-gray-900/50" style={{border: `1px solid ${driver1.driver.color}`}}>
                    <h4 className="font-bold text-lg" style={{color: driver1.driver.color}}>{driver1.driver.name}</h4>
                    <p className="text-2xl font-mono">{formatTime(driver1State.lapTime * driver1.lapData.lapTime/88)}</p>
                    <p className={`text-lg font-mono ${timeDelta < 0 ? 'text-green-400' : ''}`}>{driver1State.distance > driver2State.distance ? `Leader` : formatDelta(-timeDelta)}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-900/50 md:col-span-2" style={{border: `1px solid ${leadDriverData.driver.color}`}}>
                     <h4 className="font-bold text-lg mb-2" style={{color: leadDriverData.driver.color}}>Live Telemetry ({leadDriverData.driver.abbreviation})</h4>
                     <ResponsiveContainer width="100%" height={80}>
                        <LineChart data={liveTelemetry} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <XAxis dataKey="distance" hide />
                            <YAxis domain={[0, 360]} hide />
                            <Tooltip contentStyle={{ backgroundColor: '#1A202C', border: 'none' }} labelStyle={{ color: '#A0AEC0' }} />
                            <Legend />
                            <Line type="monotone" dataKey="speed" stroke="#8884d8" strokeWidth={2} dot={false} name="Speed (km/h)" />
                            <Line type="monotone" dataKey="throttle" stroke="#82ca9d" strokeWidth={2} dot={false} name="Throttle" />
                            <Line type="monotone" dataKey="brake" stroke="#ca8282" strokeWidth={2} dot={false} name="Brake" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="p-4 rounded-lg bg-gray-900/50" style={{border: `1px solid ${driver2.driver.color}`}}>
                     <h4 className="font-bold text-lg" style={{color: driver2.driver.color}}>{driver2.driver.name}</h4>
                     <p className="text-2xl font-mono">{formatTime(driver2State.lapTime * driver2.lapData.lapTime/88)}</p>
                    <p className={`text-lg font-mono ${timeDelta > 0 ? 'text-green-400' : ''}`}>{driver2State.distance > driver1State.distance ? `Leader` : formatDelta(timeDelta)}</p>
                </div>
            </div>
        </div>
    );
};