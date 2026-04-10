"use client";
import { create } from "zustand";
import React, { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Navigation, MapPin, Cloud, Droplets, Thermometer } from "lucide-react";
import { Button } from "../ui/button";
import Location from "./location";
import { useWeatherStore } from "@/store/weatherStore";
import { fetchWeather } from "./fetch";




const Weather = () => {
  const weather = useWeatherStore((s) => s.weather);
  const fetchingLocation = useWeatherStore((s) => s.fetchingLocation);

  return (
    <Card className="mb-6 shadow-lg border rounded-2xl bg-gradient-to-br from-white to-gray-50">
      <CardHeader>
        <CardTitle className="flex justify-between items-center text-lg font-semibold">
          🌦 Weather Dashboard
yt
          <div className="flex gap-2">
            {/* This triggers fetchWeather */}
            <Location onLocation={fetchWeather} />
             
            <Button
              disabled
              variant="secondary"
              className="flex items-center gap-2"
            >
              <Navigation className="size-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {fetchingLocation ? (
          <div className="text-center py-6 animate-pulse text-gray-500">
            Fetching weather data...
          </div>
        ) : weather ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="size-4 text-blue-500" />
              <span className="font-medium">{weather.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <Thermometer className="size-6 text-red-500" />
              <span className="text-3xl font-bold">
                {weather.main.temp}°C
              </span>
            </div>

            <div className="flex items-center gap-2 text-gray-600 capitalize">
              <Cloud className="size-5 text-gray-500" />
              {weather.weather[0].description}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Droplets className="size-5 text-blue-400" />
              Humidity: {weather.main.humidity}%
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p className="mb-2">No weather data yet 🌍</p>
            <p className="text-sm">
              Click <span className="font-medium">"Get Location"</span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Weather;