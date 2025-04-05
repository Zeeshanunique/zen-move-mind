
import React from "react";
import { useActivities } from "../context/ActivityContext";
import ActivityCard from "../components/ActivityCard";
import { Link } from "react-router-dom";
import { PlusCircle } from "lucide-react";

const Index = () => {
  const { getTodayActivities } = useActivities();
  const todayActivities = getTodayActivities();
  
  const totalMinutes = todayActivities.reduce(
    (sum, activity) => sum + activity.duration, 
    0
  );
  
  const exerciseCount = todayActivities.filter(a => a.type === "exercise").length;
  const meditationCount = todayActivities.filter(a => a.type === "meditation").length;

  return (
    <div className="zen-container">
      <header>
        <h1 className="text-2xl font-medium mb-6">ZenMoveMinds</h1>
      </header>

      <section className="mb-8">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="card bg-zen-50">
            <p className="text-muted-foreground text-sm">Today's Activity</p>
            <p className="text-2xl font-medium mt-1">{totalMinutes} min</p>
          </div>
          <div className="card">
            <p className="text-muted-foreground text-sm">Sessions</p>
            <div className="flex mt-1 gap-2">
              <span className="bg-zen-100 text-zen-600 px-2 py-1 rounded-md text-sm">
                {exerciseCount} Exercise
              </span>
              <span className="bg-accent text-accent-foreground px-2 py-1 rounded-md text-sm">
                {meditationCount} Meditation
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <Link to="/exercise" className="flex-1">
            <button className="btn-primary w-full flex justify-center items-center gap-2">
              <PlusCircle size={20} />
              Exercise
            </button>
          </Link>
          <Link to="/meditation" className="flex-1">
            <button className="btn-secondary w-full flex justify-center items-center gap-2">
              <PlusCircle size={20} />
              Meditate
            </button>
          </Link>
        </div>
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Today's Activities</h2>
        </div>
        
        {todayActivities.length > 0 ? (
          <div>
            {todayActivities.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No activities logged today.</p>
            <p className="text-muted-foreground text-sm mt-1">Start by adding an exercise or meditation.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
