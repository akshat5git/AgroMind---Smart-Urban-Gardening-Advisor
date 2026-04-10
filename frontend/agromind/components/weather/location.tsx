"use client";

import { toast } from "sonner";

export default function Location({ onLocation }: { onLocation: (lat: number, lon: number) => void }) {

  const getLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported");
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        onLocation(lat, lon); // 🔥 send to parent
      },
      () => {
        toast.error("Permission denied");
      }
    );
  };

  return (
    <button
      onClick={getLocation}
      className="px-3 py-2 bg-green-600 text-white rounded">
      Get Location
    </button>
  );
}