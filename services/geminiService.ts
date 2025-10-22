import type { Driver, F1Data } from '../types';
import { DRIVERS } from '../constants';

// This function simulates a call to the Gemini API.
// In a real application, this would make an async call to `ai.models.generateContent`
// to fetch live or historical F1 data.
// For this example, it returns realistic mock data with driver-specific characteristics.
export const generateF1Data = async (
  driver1: Driver,
  driver2: Driver
): Promise<F1Data> => {
  console.log(`Generating mock data for ${driver1.name} and ${driver2.name}`);

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const generateRandomTelemetry = (driver: Driver) => {
    const points = 200; // Increased telemetry resolution
    const telemetry = [];

    // Simulate different driving styles based on driver
    let aggression = 1.0;
    let consistency = 0.05; // lower is more consistent

    switch (driver.id) {
        case 'verstappen':
            aggression = 1.15; // Higher top speed, more aggressive braking
            consistency = 0.03;
            break;
        case 'hamilton':
            aggression = 1.05; // Smoother, high average speed
            consistency = 0.01;
            break;
        case 'alonso':
            aggression = 1.1; // Aggressive but experienced
            consistency = 0.02;
            break;
        case 'norris':
            aggression = 1.08;
            consistency = 0.04;
            break;
        default:
            aggression = 1.0;
            consistency = 0.05;
            break;
    }

    for (let i = 0; i <= points; i++) {
      const distance = i / points; // Normalized distance (0 to 1)
      
      // Simulating corners and straights on the track
      const trackPositionFactor = Math.sin(distance * Math.PI * 4) + Math.sin(distance * Math.PI * 1.5);
      const speedFluctuation = (Math.random() - 0.5) * 15 * (1 + consistency);
      
      let baseSpeed = (220 + (trackPositionFactor * 60)) * aggression;
      const currentSpeed = Math.max(80, Math.min(350, baseSpeed + speedFluctuation));

      telemetry.push({
        distance,
        speed: currentSpeed,
        gear: Math.round(Math.max(2, currentSpeed / 40)),
        throttle: currentSpeed > 200 ? Math.min(1, 0.9 + Math.random() * 0.1 * aggression) : 0.8,
        brake: currentSpeed < 120 && trackPositionFactor < -0.5 ? Math.random() * aggression : 0,
      });
    }
    return telemetry;
  };

  const getDriverData = (driver: Driver) => {
    const baseLapTime = 88 + Math.random() * 2; // Lap times around 1:28
    const statsSeed = driver.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return {
      driver,
      stats: {
        wins: (statsSeed % 30) + (driver.name === 'Lewis Hamilton' ? 103 : driver.name === 'Max Verstappen' ? 60 : 5),
        podiums: (statsSeed % 70) + (driver.name === 'Lewis Hamilton' ? 197 : driver.name === 'Max Verstappen' ? 105 : 20) * 2,
        poles: (statsSeed % 40) + (driver.name === 'Lewis Hamilton' ? 104 : driver.name === 'Max Verstappen' ? 40 : 10),
        championships: (statsSeed % 3) + (driver.name === 'Lewis Hamilton' ? 7 : driver.name === 'Max Verstappen' ? 3 : 0),
        races: 150 + (statsSeed % 150),
      },
      lapData: {
        driverId: driver.id,
        race: "Silverstone",
        year: 2023,
        lapNumber: 42,
        lapTime: baseLapTime,
        sector1: baseLapTime * 0.33 + (Math.random() - 0.5),
        sector2: baseLapTime * 0.34 + (Math.random() - 0.5),
        sector3: baseLapTime * 0.33 + (Math.random() - 0.5),
        telemetry: generateRandomTelemetry(driver),
      },
    };
  };

  return {
    driver1: getDriverData(driver1),
    driver2: getDriverData(driver2),
  };
};