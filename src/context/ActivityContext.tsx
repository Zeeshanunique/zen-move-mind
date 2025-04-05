
import React, { createContext, useContext, useState, useEffect } from "react";
import { Activity, Exercise, Meditation } from "../types";

interface ActivityContextType {
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  getActivitiesByDate: (date: string) => Activity[];
  getActivitiesByType: (type: Activity["type"]) => Activity[];
  getTodayActivities: () => Activity[];
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const useActivities = () => {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
};

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem("zen-activities");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("zen-activities", JSON.stringify(activities));
  }, [activities]);

  const addActivity = (activity: Activity) => {
    setActivities((prev) => [...prev, { ...activity, id: crypto.randomUUID() }]);
  };

  const getActivitiesByDate = (date: string) => {
    const targetDate = date.split("T")[0];
    return activities.filter((activity) => 
      activity.date.split("T")[0] === targetDate
    );
  };

  const getActivitiesByType = (type: Activity["type"]) => {
    return activities.filter((activity) => activity.type === type);
  };

  const getTodayActivities = () => {
    const today = new Date().toISOString().split("T")[0];
    return getActivitiesByDate(today);
  };

  return (
    <ActivityContext.Provider
      value={{
        activities,
        addActivity,
        getActivitiesByDate,
        getActivitiesByType,
        getTodayActivities,
      }}
    >
      {children}
    </ActivityContext.Provider>
  );
};
