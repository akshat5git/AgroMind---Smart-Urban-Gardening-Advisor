"use client";

import { toast } from "sonner";
import { MapPin } from "lucide-react";
import { fetchWeather } from "./fetch";


type Props = {
  onLocation?: (lat: number, lon: number) => void; // optional callback
  variant?: "button" | "icon"; // UI control
  className?: string;
};

export default function Location({
  onLocation,
  variant = "button",
  className = "",
}: Props) {

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        // 🔥 1. Always update global store (existing behavior)
        await fetchWeather(lat, lon);

        // 🔥 2. If parent wants data → send it
        if (onLocation) {
          onLocation(lat, lon);
        }

        toast.success("Location attached");
      },
      () => {
        toast.error("Permission denied");
      }
    );
  };

  // 🎨 UI Variants
  if (variant === "icon") {
    return (
      <button
        onClick={getLocation}
        className={`text-gray-500 hover:text-green-600 ${className}`}
      >
        <MapPin size={20} />
      </button>
    );
  }

  return (
    <button
      onClick={getLocation}
      className={`px-3 py-2 bg-green-600 text-white rounded ${className}`}
    >
      Get Location
    </button>
  );
}