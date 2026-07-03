export type CrowdTone = "low" | "medium" | "high";

export interface PlannerSlot {
  time: string;
  title: string;
  weather: string;
  light: string;
  crowdLevel: number;
  note: string;
}

export interface SnapSpot {
  id: string;
  name: string;
  region: string;
  mood: string;
  description: string;
  bestTime: string;
  crowdLevel: number;
  accentColor: string;
  mapPosition: {
    top: string;
    left: string;
  };
  tags: string[];
}

export interface CourseStop {
  time: string;
  type: string;
  title: string;
  area: string;
  duration: string;
  note: string;
  accentColor: string;
}

export interface PhotoBookEntry {
  title: string;
  place: string;
  date: string;
  accentColor: string;
}
