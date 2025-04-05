
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useActivities } from "../context/ActivityContext";
import { Meditation } from "../types";
import { ArrowLeft, Play, Pause, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const MeditationPage = () => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();
  const { toast } = useToast();
  
  const [isActive, setIsActive] = useState(false);
  const [time, setTime] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(5); // 5 minutes default
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [meditationData, setMeditationData] = useState<Partial<Meditation>>({
    type: "meditation",
    name: "Meditation Session",
    duration: 0,
    focusType: "breath",
    notes: "",
  });
  
  const intervalRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (isActive) {
      intervalRef.current = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
    
    // Convert seconds to minutes
    const durationInMinutes = Math.ceil(time / 60);
    
    setMeditationData(prev => ({
      ...prev,
      duration: durationInMinutes,
    }));
    
    setShowSaveForm(true);
  };
  
  const handleSelectDuration = (minutes: number) => {
    setSelectedDuration(minutes);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMeditationData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!meditationData.name) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your meditation session.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the meditation activity with current date
    const newMeditation: Meditation = {
      ...meditationData as Meditation,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    addActivity(newMeditation);
    
    toast({
      title: "Meditation Logged",
      description: `${newMeditation.name} has been saved successfully.`,
    });
    
    navigate("/");
  };
  
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  if (showSaveForm) {
    return (
      <div className="zen-container">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => setShowSaveForm(false)} 
            className="mr-2 p-1 rounded-full hover:bg-muted"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-medium">Save Meditation</h1>
        </div>
        
        <div className="mb-6 text-center">
          <p className="text-lg">
            Great job! You meditated for {Math.ceil(time / 60)} minutes.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Name
            </label>
            <input
              type="text"
              name="name"
              value={meditationData.name}
              onChange={handleChange}
              placeholder="Morning Meditation, Mindfulness, etc."
              className="w-full px-3 py-2 rounded-lg border bg-background"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Focus Type
            </label>
            <select
              name="focusType"
              value={meditationData.focusType}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border bg-background"
            >
              <option value="breath">Breath Focus</option>
              <option value="body">Body Scan</option>
              <option value="visualization">Visualization</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              Notes (optional)
            </label>
            <textarea
              name="notes"
              value={meditationData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="How was your session? How do you feel?"
              className="w-full px-3 py-2 rounded-lg border bg-background"
            />
          </div>
          
          <button type="submit" className="btn-primary w-full mt-6 flex items-center justify-center gap-2">
            <Save size={18} />
            Save Session
          </button>
        </form>
      </div>
    );
  }
  
  return (
    <div className="zen-container">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => navigate(-1)} 
          className="mr-2 p-1 rounded-full hover:bg-muted"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-medium">Meditation</h1>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="animate-breathe flex items-center justify-center w-48 h-48 rounded-full bg-zen-100 border-4 border-zen-200">
          <div className="text-3xl font-medium text-zen-800">
            {formatTime(time)}
          </div>
        </div>
      </div>
      
      {!isActive && time === 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-3">Select Duration</h2>
          <div className="grid grid-cols-3 gap-3">
            {[5, 10, 15, 20, 30, 45].map((minutes) => (
              <button
                key={minutes}
                onClick={() => handleSelectDuration(minutes)}
                className={`py-2 rounded-lg border transition-all ${
                  selectedDuration === minutes 
                    ? "border-zen-400 bg-zen-50 text-zen-800" 
                    : "border-border"
                }`}
              >
                {minutes} min
              </button>
            ))}
          </div>
        </div>
      )}
      
      <div className="flex gap-4 mb-10">
        <button
          onClick={handleStartStop}
          className="btn-primary flex-1 flex items-center justify-center gap-2"
        >
          {isActive ? (
            <>
              <Pause size={20} />
              Pause
            </>
          ) : (
            <>
              <Play size={20} />
              {time > 0 ? "Resume" : "Start"}
            </>
          )}
        </button>
        
        {time > 0 && (
          <button
            onClick={handleFinish}
            className="btn-secondary flex-1 flex items-center justify-center gap-2"
          >
            <Save size={20} />
            Finish
          </button>
        )}
      </div>
      
      {isActive && (
        <p className="text-center text-muted-foreground">
          Focus on your breath and let go of your thoughts.
        </p>
      )}
    </div>
  );
};

export default MeditationPage;
