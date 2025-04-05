
import React, { useState, useMemo } from "react";
import { useActivities } from "../context/ActivityContext";
import ActivityCard from "../components/ActivityCard";
import { Calendar, Filter } from "lucide-react";
import { format, subDays, isSameDay } from "date-fns";

const HistoryPage = () => {
  const { activities, getActivitiesByType } = useActivities();
  const [activeFilter, setActiveFilter] = useState<"all" | "exercise" | "meditation">("all");

  // Get filtered activities
  const filteredActivities = useMemo(() => {
    if (activeFilter === "all") {
      return activities;
    }
    return getActivitiesByType(activeFilter);
  }, [activities, activeFilter, getActivitiesByType]);

  // Group activities by date
  const groupedActivities = useMemo(() => {
    const groups: { [date: string]: typeof filteredActivities } = {};
    
    filteredActivities.forEach((activity) => {
      const dateKey = activity.date.split("T")[0];
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(activity);
    });
    
    // Sort dates in descending order
    return Object.entries(groups)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, activities]) => ({
        date,
        activities,
      }));
  }, [filteredActivities]);

  const getDateHeading = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = subDays(today, 1);
    
    if (isSameDay(date, today)) {
      return "Today";
    } else if (isSameDay(date, yesterday)) {
      return "Yesterday";
    } else {
      return format(date, "EEEE, MMMM d");
    }
  };

  return (
    <div className="zen-container">
      <header className="mb-6">
        <h1 className="text-xl font-medium">Activity History</h1>
      </header>

      <div className="mb-6">
        <div className="flex items-center mb-3">
          <Filter size={18} className="mr-2 text-muted-foreground" />
          <span className="text-sm font-medium">Filter</span>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-1 rounded-full text-sm ${
              activeFilter === "all" 
                ? "bg-zen-400 text-white" 
                : "bg-secondary text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setActiveFilter("exercise")}
            className={`px-4 py-1 rounded-full text-sm ${
              activeFilter === "exercise" 
                ? "bg-zen-400 text-white" 
                : "bg-secondary text-foreground"
            }`}
          >
            Exercise
          </button>
          <button
            onClick={() => setActiveFilter("meditation")}
            className={`px-4 py-1 rounded-full text-sm ${
              activeFilter === "meditation" 
                ? "bg-zen-400 text-white" 
                : "bg-secondary text-foreground"
            }`}
          >
            Meditation
          </button>
        </div>
      </div>

      {groupedActivities.length > 0 ? (
        <div>
          {groupedActivities.map(({ date, activities }) => (
            <div key={date} className="mb-6">
              <div className="flex items-center mb-2">
                <Calendar size={16} className="mr-2 text-muted-foreground" />
                <h2 className="text-sm font-medium text-muted-foreground">
                  {getDateHeading(date)}
                </h2>
              </div>
              
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No activities found.</p>
          {activeFilter !== "all" && (
            <p className="text-muted-foreground text-sm mt-1">
              Try changing your filter or log some activities.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryPage;
