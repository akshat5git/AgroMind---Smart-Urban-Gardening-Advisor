"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trees, MapPin, Sprout, Check } from "lucide-react";

type Garden = {
  id: string;
  name: string;
  location: string;
  spaceType: string;
  plantings: any[];
};

type Props = {
  selectable?: boolean; // 🔥 enable attach mode
  onSelect?: (garden: Garden) => void; // 🔥 return selected garden
};

const GardenSection = ({ selectable = false, onSelect }: Props) => {
  const router = useRouter();
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchGardens = async () => {
      try {
        const res = await fetch("/api/garden/list");
        const data = await res.json();
        setGardens(data);
      } catch (err) {
        console.error("Error fetching gardens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchGardens();
  }, []);

  const handleClick = (garden: Garden) => {
    if (selectable) {
      setSelectedId(garden.id);
      onSelect?.(garden);
    } else {
      router.push(`/garden/${garden.id}`);
    }
  };

  return (
    <div className="mt-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
        <h2 className="text-xl font-semibold text-green-700 flex items-center gap-2">
          <Trees className="size-5" />
          My Gardens
        </h2>

        {!selectable && (
          <Button
            onClick={() => router.push("/garden/create")}
            className="bg-green-600 hover:bg-green-700"
          >
            + Create Garden
          </Button>
        )}
      </div>

      {/* LOADING */}
      {loading && (
        <p className="text-gray-500 text-center py-6">
          Loading gardens...
        </p>
      )}

      {/* EMPTY */}
      {!loading && gardens.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Trees className="mx-auto mb-3 opacity-40" size={40} />
          <p>No gardens yet</p>
          <p className="text-sm">Create your first garden 🌱</p>
        </div>
      )}

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
        {gardens.map((garden) => {
          const isSelected = selectedId === garden.id;

          return (
            <Card
              key={garden.id}
              onClick={() => handleClick(garden)}
              className={`cursor-pointer transition rounded-xl border hover:shadow-xl
                ${isSelected ? "ring-2 ring-green-500" : ""}
              `}
            >
              <CardContent className="p-3 sm:p-4 space-y-2 relative">

                {/* ✅ SELECT ICON */}
                {selectable && isSelected && (
                  <div className="absolute top-2 right-2 bg-green-600 text-white p-1 rounded-full">
                    <Check size={14} />
                  </div>
                )}

                {/* NAME */}
                <h3 className="font-semibold text-base sm:text-lg">
                  {garden.name}
                </h3>

                {/* LOCATION */}
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <MapPin size={14} />
                  {garden.location}
                </p>

                {/* PLANTS */}
                <p className="text-sm text-gray-600 flex items-center gap-1">
                  <Sprout size={14} />
                  {garden.plantings?.length || 0} plants
                </p>

                {/* SPACE */}
                <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                  {garden.spaceType}
                </span>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default GardenSection;