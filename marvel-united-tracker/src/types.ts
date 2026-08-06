export type MarkerType = 'unlocked' | 'defeated';

export interface MapMarker {
  id: string;
  x: number;
  y: number;
  type: MarkerType;
}

export type HeroStatus = 'available' | 'resting' | 'lost';

export interface Hero {
  id: string;
  name: string;
  status: HeroStatus;
}

export type ToolType = 'pan' | 'unlocked' | 'defeated';
