"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Leaf } from "lucide-react";
import { toast } from "sonner";
import Location from "@/components/weather/location";
import { fetchWeather } from "@/components/weather/fetch";
import { useWeatherStore } from "@/store/weatherStore";
import { useGardenStore } from "@/store/gardenStore";
import { useRouter } from "next/navigation";

const CreateGarden = () => {
  const router = useRouter();

  const form = useGardenStore((s) => s.form);
  const setField = useGardenStore((s) => s.setField);
  const resetForm = useGardenStore((s) => s.resetForm);

  const weather = useWeatherStore((s) => s.weather);

  const isDisabled =
    !form.name || !form.spaceType || !form.area || !weather;

  const spaceTypes = [
    "BALCONY",
    "TERRACE",
    "INDOOR",
    "BACKYARD",
    "ROOFTOP",
    "GREENHOUSE",
    "FARM",
    "COMMUNITY_GARDEN",
    "VERTICAL_GARDEN",
  ];

  const formatLabel = (value: string) =>
    value.replaceAll("_", " ").toLowerCase();

  const handleSubmit = () => {
    if (!form.name || !form.spaceType || !form.area) {
      toast.error("Please fill required fields");
      return;
    }

    router.push("/garden/recommend");
    toast.success("Proceeding to crop selection 🌱");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex justify-center items-center p-4">
      <Card className="w-full max-w-2xl shadow-xl rounded-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Leaf className="text-green-600" />
            Create Your Garden 🌱
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          {/* Garden Name */}
          <div>
            <label className="text-sm font-medium">Garden Name</label>
            <Input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
            />
          </div>

          {/* Space Type */}
          <div>
            <label className="text-sm font-medium">Space Type</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {spaceTypes.map((type) => (
                <Button
                  key={type}
                  variant={form.spaceType === type ? "default" : "outline"}
                  onClick={() => setField("spaceType", type)}
                >
                  {formatLabel(type)}
                </Button>
              ))}
            </div>
          </div>

          {/* Area */}
          <div>
            <label className="text-sm font-medium">Area (sq ft)</label>
            <Input
              type="number"
              value={form.area}
              onChange={(e) => setField("area", e.target.value)}
            />
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-medium">Location</label>
            <div className="flex gap-2 mt-2">
              <Input
                value={weather?.name || "Not detected"}
                readOnly
              />

              <Location onLocation={fetchWeather} />
            </div>
          </div>

          {/* Sunlight */}
          <div>
            <label className="text-sm font-medium">Sunlight</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {["LOW", "MEDIUM", "FULL"].map((s) => (
                <Button
                  key={s}
                  variant={form.sunlight === s ? "default" : "outline"}
                  onClick={() => setField("sunlight", s)}
                >
                  {s.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Water */}
          <div>
            <label className="text-sm font-medium">Water Availability</label>
            <div className="flex gap-2 flex-wrap mt-2">
              {["LOW", "MEDIUM", "HIGH"].map((w) => (
                <Button
                  key={w}
                  variant={form.water === w ? "default" : "outline"}
                  onClick={() => setField("water", w)}
                >
                  {w.toLowerCase()}
                </Button>
              ))}
            </div>
          </div>

          {/* Reset */}
          <Button
            variant="outline"
            onClick={() => {
              resetForm();
              toast("Form reset");
            }}
          >
            Reset Form
          </Button>

          {/* Submit */}
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400"
          >
            Continue → Get Recommendations
          </Button>

        </CardContent>
      </Card>
    </div>
  );
};

export default CreateGarden;