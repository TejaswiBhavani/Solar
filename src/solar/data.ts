import { PlanetDef, distanceScale, earthRadiusUnits, baseAngularSpeed } from './types'

const raw: Array<{
  name: string; radiusEarth: number; distanceAU: number; periodYears: number; color: number; hasRings?: boolean; hasMoon?: boolean; description: string
}> = [
  { name: 'Sun',     radiusEarth: 109,  distanceAU: 0,    periodYears: 0,     color: 0xffcc33, hasRings: false, hasMoon: false, description: 'The star at the center of our solar system.' },
  { name: 'Mercury', radiusEarth: 0.383, distanceAU: 0.39, periodYears: 0.241, color: 0x8c8c8c, description: 'The smallest and innermost planet.' },
  { name: 'Venus',   radiusEarth: 0.949, distanceAU: 0.72, periodYears: 0.615, color: 0xffa500, description: 'A hot world with a thick atmosphere.' },
  { name: 'Earth',   radiusEarth: 1.0,   distanceAU: 1.00, periodYears: 1.000, color: 0x4f94cd, hasMoon: true, description: 'Our home, teeming with life.' },
  { name: 'Mars',    radiusEarth: 0.532, distanceAU: 1.52, periodYears: 1.881, color: 0xcd5c5c, description: 'The red planet.' },
  { name: 'Jupiter', radiusEarth: 11.21, distanceAU: 5.20, periodYears: 11.86, color: 0xdaa520, description: 'A massive gas giant with storms.' },
  { name: 'Saturn',  radiusEarth: 9.45,  distanceAU: 9.58, periodYears: 29.46, color: 0xfad5a5, hasRings: true, description: 'Famous for its rings.' },
]

export const planetsData: PlanetDef[] = raw.map(p => ({
  name: p.name,
  size: Math.max(0.6, earthRadiusUnits * p.radiusEarth),
  distance: p.distanceAU * distanceScale,
  speed: p.periodYears > 0 ? baseAngularSpeed / p.periodYears : 0,
  color: p.color,
  hasRings: p.hasRings,
  hasMoon: p.hasMoon,
  description: p.description,
}))

