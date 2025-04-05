
export type ActivityType = "exercise" | "meditation";

export interface Activity {
  id: string;
  type: ActivityType;
  name: string;
  duration: number; // in minutes
  date: string; // ISO string
  notes?: string;
}

export interface Exercise extends Activity {
  type: "exercise";
  category: "cardio" | "strength" | "flexibility" | "other";
  calories?: number;
}

export interface Meditation extends Activity {
  type: "meditation";
  focusType?: "breath" | "body" | "visualization" | "other";
}
