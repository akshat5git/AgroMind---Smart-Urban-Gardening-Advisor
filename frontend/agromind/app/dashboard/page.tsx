"use client";

import Sidebar from "@/components/slidebar/Slidebar";



import GardensSection from "@/components/GardenManager";

import { useSession } from "next-auth/react";
import InsightCard from "@/components/dashboard/insightcard";
import TasksCard from "@/components/dashboard/tasksCard";
import QuickActions from "@/components/dashboard/quickaction";
import WeatherCard from "@/components/weather/Weather";

export default function Dashboard() {
  const { data: session } = useSession();

  return (
    <div className="flex bg-gray-50 min-h-screen">

      <Sidebar />

      <div className="flex-1 md:ml-64 p-4 md:p-6 space-y-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">
              Hi, {session?.user?.name} 👋
            </h1>
            <p className="text-gray-500 text-sm">
              Good Evening 🌆
            </p>
          </div>
        </div>

        {/* WEATHER */}
        <WeatherCard />

        {/* INSIGHT + TASKS */}
        <div className="grid md:grid-cols-2 gap-6">
          <InsightCard />
          <TasksCard />
        </div>

        {/* GARDENS */}
        <GardensSection />

        {/* QUICK ACTIONS */}
        <QuickActions />

      </div>
    </div>
  );
}