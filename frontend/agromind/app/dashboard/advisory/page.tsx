"use client";

import React, { useState } from "react";
import { useWeatherStore } from "@/store/weatherStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

// 🔥 Recommendation logic
const getRecommendedCrops = (temp: number) => {
  if (temp < 15) return ["Spinach", "Peas"];
  if (temp >= 15 && temp <= 30) return ["Tomato", "Cucumber", "Pepper"];
  if (temp > 30) return ["Rice", "Maize", "Cotton"];
};


const CreateGarden = () => {
  const weather = useWeatherStore((s) => s.weather);

  const [gardenName, setGardenName] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [customCrop, setCustomCrop] = useState("");

  const recommendedCrops = weather
    ? getRecommendedCrops(weather.main.temp)
    : [];

  const addCrop = (crop: string) => {
    if (!selectedCrops.includes(crop)) {
      setSelectedCrops([...selectedCrops, crop]);
    }
  };

  const removeCrop = (crop: string) => {
    setSelectedCrops(selectedCrops.filter((c) => c !== crop));
  };

  const handleAddCustomCrop = () => {
    if (customCrop.trim()) {
      addCrop(customCrop);
      setCustomCrop("");
    }
  };

  const handleCreateGarden = async () => {
    if (!gardenName || selectedCrops.length === 0) {
      toast.error("Please enter garden name and select crops");
      return;
    }

    try {
      await fetch("/api/garden", {
        method: "POST",
        body: JSON.stringify({
          name: gardenName,
          crops: selectedCrops,
          location: weather?.name,
          temperature: weather?.main.temp,
        }),
      });

      toast.success("Garden created 🌱");
    } catch {
      toast.error("Failed to create garden");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">🌱 Create Garden</h1>

      {/* Garden Name */}
      <Input
        placeholder="Enter garden name"
        value={gardenName}
        onChange={(e) => setGardenName(e.target.value)}
      />

      {/* Weather Info */}
      {weather && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <p>📍 {weather.name}</p>
          <p>🌡 {weather.main.temp}°C</p>
        </div>
      )}

      {/* Recommended Crops */}
      <div>
        <h2 className="font-semibold mb-2">
          🌾 Recommended Crops (based on weather)
        </h2>

        <div className="flex gap-2 flex-wrap">
          {recommendedCrops.map((crop) => (
            <button
              key={crop}
              onClick={() => addCrop(crop)}
              className="px-3 py-1 bg-green-100 rounded-full hover:bg-green-200"
            >
              {crop}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Crops */}
      <div>
        <h2 className="font-semibold mb-2">Selected Crops</h2>

        <div className="flex gap-2 flex-wrap">
          {selectedCrops.map((crop) => (
            <span
              key={crop}
              onClick={() => removeCrop(crop)}
              className="px-3 py-1 bg-green-500 text-white rounded-full cursor-pointer"
            >
              {crop} ✕
            </span>
          ))}
        </div>
      </div>

      {/* Custom Crop */}
      <div className="flex gap-2">
        <Input
          placeholder="Add custom crop"
          value={customCrop}
          onChange={(e) => setCustomCrop(e.target.value)}
        />
        <Button onClick={handleAddCustomCrop}>Add</Button>
      </div>

      {/* Create Button */}
      <Button
        className="w-full bg-green-600 hover:bg-green-700"
        onClick={handleCreateGarden}
      >
        Create Garden
      </Button>
    </div>
  );
};

export default CreateGarden;