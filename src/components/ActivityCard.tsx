
import React from "react";
import { Activity, Exercise, Meditation } from "../types";
import { Clock, Calendar, Activity as ActivityIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityCardProps {
  activity: Activity;
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity }) => {
  const isExercise = activity.type === "exercise";
  const timeAgo = formatDistanceToNow(new Date(activity.date), { addSuffix: true });
  
  const formatDuration = (minutes: number): string => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes > 0 ? `${remainingMinutes}m` : ''}`;
  };

  return (
    <div className="card mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-lg">{activity.name}</h3>
          <div className="flex items-center text-muted-foreground text-sm mt-1">
            <Clock size={14} className="mr-1" /> 
            {formatDuration(activity.duration)}
            <Calendar size={14} className="ml-4 mr-1" /> 
            {timeAgo}
          </div>
        </div>
        <div className={`rounded-full p-2 ${
          isExercise ? "bg-zen-100 text-zen-600" : "bg-accent text-accent-foreground"
        }`}>
          <ActivityIcon size={20} />
        </div>
      </div>
      
      {isExercise && (activity as Exercise).calories && (
        <div className="mt-2 text-sm">
          <span className="text-muted-foreground">Calories: </span>
          <span className="font-medium">{(activity as Exercise).calories}</span>
        </div>
      )}
      
      {activity.notes && (
        <p className="mt-2 text-sm text-muted-foreground">{activity.notes}</p>
      )}
    </div>
  );
};

export default ActivityCard;
