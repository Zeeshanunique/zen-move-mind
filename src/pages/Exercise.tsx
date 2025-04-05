import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useActivities } from "../context/ActivityContext";
import { Exercise } from "../types";
import { ArrowLeft, Play, Pause, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExercisePage = () => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [exerciseData, setExerciseData] = useState<Partial<Exercise>>({
    type: "exercise",
    name: "Daily Exercise",
    duration: 0,
    category: "cardio",
    notes: "",
  });
  
  const intervalRef = useRef<number | null>(null);
  const [isPulsing, setIsPulsing] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
        // Toggle pulsing effect every second
        setIsPulsing(prev => !prev);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      setIsPulsing(false);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);
  
  const handleStartStop = () => {
    setIsActive(!isActive);
  };
  
  const handleFinish = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    setIsActive(false);
    setIsPulsing(false);
    
    // Convert seconds to minutes
    const durationInMinutes = Math.ceil(time / 60);
    
    if (durationInMinutes < 1) {
      toast({
        title: "Exercise too short",
        description: "Exercise must be at least 1 minute long.",
        variant: "destructive",
      });
      return;
    }
    
    setExerciseData(prev => ({
      ...prev,
      duration: durationInMinutes,
    }));
    
    const newExercise: Exercise = {
      ...exerciseData as Exercise,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      duration: durationInMinutes,
    };
    
    addActivity(newExercise);
    
    toast({
      title: "Exercise Logged",
      description: `${durationInMinutes} minutes of exercise logged successfully.`,
    });
    
    // Reset timer
    setTime(0);
    navigate("/");
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  // Define dynamic styles based on activity state
  const getTimerStyles = () => {
    const baseClasses = "text-5xl font-bold transition-colors duration-300";
    
    if (!isActive) {
      return `${baseClasses} text-zen-800`;
    }
    
    return isPulsing 
      ? `${baseClasses} text-red-600`
      : `${baseClasses} text-red-500`;
  };

  const getCircleStyles = () => {
    const baseClasses = "flex items-center justify-center w-64 h-64 rounded-full transition-all duration-300";
    
    if (!isActive) {
      return `${baseClasses} bg-zen-100 border-4 border-zen-200`;
    }
    
    return isPulsing 
      ? `${baseClasses} bg-red-100 border-4 border-red-400`
      : `${baseClasses} bg-red-50 border-4 border-red-300`;
  };

  return (
    <div className="zen-container">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-2 p-1 rounded-full hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">Daily Exercise</h1>
      </div>
      
      <div className="flex justify-center mb-12">
        <div className={getCircleStyles()}>
          <div className={getTimerStyles()}>
            {formatTime(time)}
          </div>
        </div>
      </div>
      
      <div className="flex gap-4 mb-10">
        <button
          onClick={handleStartStop}
          className={`w-full py-6 text-xl font-bold flex items-center justify-center gap-3 transition-colors ${
            isActive ? "bg-red-600 hover:bg-red-700 text-white" : "btn-primary"
          }`}
        >
          {isActive ? (
            <>
              <Pause size={24} />
              STOP
            </>
          ) : (
            <>
              <Play size={24} />
              {time > 0 ? "RESUME" : "START"}
            </>
          )}
        </button>
      </div>
      
      {time > 0 && !isActive && (
        <button
          onClick={handleFinish}
          className="btn-secondary w-full py-4 flex items-center justify-center gap-2"
        >
          <Save size={20} />
          Save Exercise
        </button>
      )}
      
      {isActive && (
        <p className="text-center text-muted-foreground mt-4">
          Your exercise time is being tracked. Press STOP when finished.
        </p>
      )}
    </div>
  );
};

export default ExercisePage;
