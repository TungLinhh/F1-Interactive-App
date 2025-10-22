export interface Driver {
  id: string;
  name: string;
  abbreviation: string;
  team: string;
  carImageUrl: string;
  nationality: string;
  color: string;
}

export interface DriverStats {
  wins: number;
  podiums: number;
  poles: number;
  championships: number;
  races: number;
}

export interface TelemetryPoint {
  distance: number; // as a fraction of lap, 0 to 1
  speed: number;
  gear: number;
  throttle: number;
  brake: number;
}

export interface LapData {
  driverId: string;
  race: string;
  year: number;
  lapNumber: number;
  lapTime: number; // in seconds
  sector1: number;
  sector2: number;
  sector3: number;
  telemetry: TelemetryPoint[];
}

export type TireCompound = 'soft' | 'medium' | 'hard';

export interface PitStop {
  lap: number;
  tire: TireCompound;
}

export interface Strategy {
  stints: PitStop[];
}

export interface F1DriverData {
  driver: Driver;
  stats: DriverStats;
  lapData: LapData;
}

export interface F1Data {
  driver1: F1DriverData;
  driver2: F1DriverData;
}

export interface Track {
    name: string;
    path: string;
    length: number; // in meters
}