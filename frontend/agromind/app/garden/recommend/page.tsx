"use client";

import { useGardenStore } from "@/store/gardenStore";
import { useWeatherStore } from "@/store/weatherStore";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const getRecommendedCrops = async (payload: any) => {
  const res = await fetch("/api/garden/recommend", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
};

const getImage = (plant: any) => {
  if (plant.imageUrls?.[0]) return plant.imageUrls[0];

  // fallback based on name
  return `https://source.unsplash.com/400x300/?${plant.commonName},plant`;
};

const Recommend = () => {
  const router = useRouter();

  const [recommendedCrops, setRecommendedCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const weather = useWeatherStore((s) => s.weather);
  const garden = useGardenStore((s) => s.form);

  const selectedCrops = useGardenStore((s) => s.form.planting);
  const toggleCrop = useGardenStore((s) => s.togglePlant);

  useEffect(() => {
    if (!weather) return;

    setLoading(true);

    getRecommendedCrops({
      temp: weather.main.temp,
      sunlight: garden.sunlight,
      water: garden.water,
      spaceType: garden.spaceType,
    })
      .then(setRecommendedCrops)
      .finally(() => setLoading(false));

  }, [
    weather?.main.temp,
    garden.sunlight,
    garden.water,
    garden.spaceType,
  ]);

  const isSelected = (id: string) =>
    selectedCrops.some((p) => p.id === id);

  return (
    <div className="p-6 max-w-6xl mx-auto pb-32">
      <h1 className="text-3xl font-bold mb-6 text-green-700">
        🌱 Recommended Crops
      </h1>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 animate-pulse">
          Finding best crops for you...
        </div>
      )}

      {/* Empty */}
      {!loading && recommendedCrops.length === 0 && (
        <div className="text-center text-gray-400">
          No recommendations found
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {recommendedCrops.map((plant) => {
          const selected = isSelected(plant.id);

          return (
            <div
              key={plant.id}
              onClick={() =>
                toggleCrop({
                  id: plant.id,
                  commonName: plant.commonName,
                  image: getImage(plant),
                })
              }
              className={`cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 
              ${selected
                  ? "border-2 border-green-600 shadow-lg scale-[1.02]"
                  : "border border-gray-200 hover:shadow-xl"
                }`}
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={getImage(plant)}
                  alt={plant.commonName}
                  className="w-full h-44 object-cover"
                />

                {selected && (
                  <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                      ✓ Selected
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                {/* Name */}
                <h2 className="text-lg font-semibold">
                  {plant.commonName}
                </h2>

                <p className="text-sm text-gray-500 italic">
                  {plant.scientificName}
                </p>

                {/* Conditions */}
                <div className="mt-2 text-sm space-y-1 text-gray-600">
                  <p>🌡 {plant.minTemp}–{plant.maxTemp}°C</p>
                  <p>☀️ {plant.sunlightRequirement}</p>
                  <p>💧 {plant.wateringRequirement}</p>
                </div>

                {/* Category */}
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {plant.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Action Bar */}
      {selectedCrops.length > 0 && (
        <div className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg p-4 flex justify-between items-center">
          <span className="text-sm text-gray-600">
            {selectedCrops.length} crops selected
          </span>

          <button
            onClick={() => router.push("/garden/summary")}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-xl"
          >
            Continue →
          </button>
        </div>
      )}
    </div>
  );
};

export default Recommend;