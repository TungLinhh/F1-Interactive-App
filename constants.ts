import type { Driver, Track } from './types';

export const DRIVERS: Driver[] = [
  { id: 'verstappen', name: 'Max Verstappen', abbreviation: 'VER', team: 'Red Bull Racing', carImageUrl: '', nationality: 'Dutch', color: '#3671C6' },
  { id: 'hamilton', name: 'Lewis Hamilton', abbreviation: 'HAM', team: 'Mercedes', carImageUrl: '', nationality: 'British', color: '#6CD3BF' },
  { id: 'leclerc', name: 'Charles Leclerc', abbreviation: 'LEC', team: 'Ferrari', carImageUrl: '', nationality: 'Monegasque', color: '#F91536' },
  { id: 'norris', name: 'Lando Norris', abbreviation: 'NOR', team: 'McLaren', carImageUrl: '', nationality: 'British', color: '#FF8000' },
  { id: 'alonso', name: 'Fernando Alonso', abbreviation: 'ALO', team: 'Aston Martin', carImageUrl: '', nationality: 'Spanish', color: '#358C75' },
  { id: 'russell', name: 'George Russell', abbreviation: 'RUS', team: 'Mercedes', carImageUrl: '', nationality: 'British', color: '#6CD3BF' },
  { id: 'sainz', name: 'Carlos Sainz', abbreviation: 'SAI', team: 'Ferrari', carImageUrl: '', nationality: 'Spanish', color: '#F91536' },
  { id: 'perez', name: 'Sergio Pérez', abbreviation: 'PER', team: 'Red Bull Racing', carImageUrl: '', nationality: 'Mexican', color: '#3671C6' },
];

export const TRACKS: Track[] = [
    {
        name: "Silverstone",
        path: "M 450,100 C 550,100 600,150 650,150 C 700,150 750,100 850,100 L 850,250 C 850,350 800,400 750,400 L 400,400 C 350,400 350,350 350,300 L 350,250 C 350,200 400,200 450,200 L 550,200 C 600,200 600,250 550,250 L 250,250 C 150,250 100,350 100,450 L 200,450 C 300,450 350,400 400,400 L 450,400 C 550,400 600,450 600,500 L 300,500 C 200,500 150,400 150,300 L 150,150 C 150,50 250,50 350,100 L 450,100 Z",
        length: 5891
    },
    {
        name: "Spa-Francorchamps",
        path: "M 300,100 L 600,100 C 700,100 750,150 750,250 L 650,450 C 600,550 500,550 450,500 L 350,300 C 300,200 200,200 150,300 L 100,500 L 200,500 L 250,450 C 300,400 400,400 450,450 L 550,500 C 600,550 650,500 650,450 L 800,200 C 850,100 750,50 650,50 L 300,50 C 200,50 250,100 300,100 Z",
        length: 7004
    },
    {
        name: "Monaco",
        path: "M 250,150 L 550,150 C 600,150 650,200 650,250 L 650,350 C 650,400 600,450 550,450 L 500,450 C 450,450 450,500 500,500 L 550,500 C 650,500 700,450 700,350 L 700,250 C 700,150 600,100 500,100 L 200,100 C 100,100 100,200 150,250 L 300,250 C 350,250 350,200 300,200 L 200,200 C 150,200 150,250 200,300 L 400,300 L 400,400 L 300,400 C 200,400 150,450 150,500 L 250,500 L 250,350 C 250,250 200,200 150,200 C 100,200 50,250 50,300 L 50,400 C 50,500 150,550 250,550 L 450,550 C 550,550 600,500 600,450 L 600,400 C 600,350 550,350 500,350 L 450,350 C 400,350 400,400 450,400 L 450,450",
        length: 3337
    }
];

export const TIRE_COMPOUNDS = {
    soft: { name: 'Soft', color: '#FF3333', baseModifier: 0, degradation: 0.003 },
    medium: { name: 'Medium', color: '#FFF200', baseModifier: 0.5, degradation: 0.0015 },
    hard: { name: 'Hard', color: '#E0E0E0', baseModifier: 1.2, degradation: 0.0008 },
};