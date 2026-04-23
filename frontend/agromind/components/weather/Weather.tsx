"use client";

import { MapPin, Thermometer, Droplets, Cloud } from "lucide-react";
import { useWeatherStore } from "@/store/weatherStore";
import Location from "@/components/weather/location";
import { fetchWeather } from "@/components/weather/fetch";

export default function WeatherCard() {
  const weather = useWeatherStore((s) => s.weather);

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border flex flex-wrap items-center justify-between gap-4">

      {/* LEFT */}
      <div className="flex flex-wrap gap-6">

        <div>
          <p className="text-sm text-gray-500">Your Location</p>
          <p className="font-semibold flex items-center gap-1">
            <MapPin size={16} /> {weather?.name || "Unknown"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Temperature</p>
          <p className="font-semibold flex items-center gap-1">
            <Thermometer size={16} /> {weather?.main?.temp || "--"}°C
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Condition</p>
          <p className="font-semibold flex items-center gap-1">
            <Cloud size={16} /> {weather?.weather?.[0]?.description || "--"}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-500">Humidity</p>
          <p className="font-semibold flex items-center gap-1">
            <Droplets size={16} /> {weather?.main?.humidity || "--"}%
          </p>
        </div>
      </div>

      {/* BUTTON */}
      <Location onLocation={fetchWeather} className="hover:bg-green-700" />

    </div>
  );
}
