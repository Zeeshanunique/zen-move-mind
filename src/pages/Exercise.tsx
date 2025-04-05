
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useActivities } from "../context/ActivityContext";
import { Exercise } from "../types";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ExercisePage = () => {
  const navigate = useNavigate();
  const { addActivity } = useActivities();
  const { toast } = useToast();

  const [exerciseData, setExerciseData] = useState<Partial<Exercise>>({
    type: "exercise",
    name: "",
    duration: 30,
    category: "cardio",
    calories: undefined,
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setExerciseData((prev) => ({
      ...prev,
      [name]: name === "duration" || name === "calories" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!exerciseData.name || !exerciseData.duration) {
      toast({
        title: "Missing Information",
        description: "Please provide a name and duration for your exercise.",
        variant: "destructive",
      });
      return;
    }
    
    // Create the activity with the current date
    const newExercise: Exercise = {
      ...exerciseData as Exercise,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
    };
    
    addActivity(newExercise);
    
    toast({
      title: "Exercise Added",
      description: `${newExercise.name} has been logged successfully.`,
    });
    
    navigate("/");
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
        <h1 className="text-xl font-medium">Log Exercise</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">
            Exercise Name
          </label>
          <input
            type="text"
            name="name"
            value={exerciseData.name}
            onChange={handleChange}
            placeholder="e.g., Running, Yoga, Weight Training"
            className="w-full px-3 py-2 rounded-lg border bg-background"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Category
          </label>
          <select
            name="category"
            value={exerciseData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border bg-background"
          >
            <option value="cardio">Cardio</option>
            <option value="strength">Strength</option>
            <option value="flexibility">Flexibility</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={exerciseData.duration}
            onChange={handleChange}
            min="1"
            className="w-full px-3 py-2 rounded-lg border bg-background"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Calories Burned (optional)
          </label>
          <input
            type="number"
            name="calories"
            value={exerciseData.calories || ""}
            onChange={handleChange}
            min="0"
            placeholder="Optional"
            className="w-full px-3 py-2 rounded-lg border bg-background"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">
            Notes (optional)
          </label>
          <textarea
            name="notes"
            value={exerciseData.notes}
            onChange={handleChange}
            rows={3}
            placeholder="How did it go? Any observations?"
            className="w-full px-3 py-2 rounded-lg border bg-background"
          />
        </div>
        
        <button type="submit" className="btn-primary w-full mt-6">
          Save Exercise
        </button>
      </form>
    </div>
  );
};

export default ExercisePage;
