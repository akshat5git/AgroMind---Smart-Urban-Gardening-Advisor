"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MapPin,
  CloudSun,
  Droplets,
  Activity,
  Navigation,
  FileText,
  Wind,
  Eye
} from "lucide-react";
import { GardenManager } from "@/components/GardenManager";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Weather from "@/components/weather/Weather";
export default function Dashboard() {
  
  const { data: session } = useSession();
  console.log("Session data:", session);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            Hii back, {session?.user?.name} 👋
          </h1>
        </div>

        {/* Weather */}
        <Weather />
        
        {/* Garden */}
        <GardenManager />

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Link href="/dashboard/detect">
            <Card className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <Activity /> Disease Detection
                </CardTitle>
                <CardDescription>
                  Upload plant image
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/dashboard/advisory">
            <Card className="cursor-pointer hover:shadow-lg">
              <CardHeader>
                <CardTitle className="flex gap-2">
                  <FileText /> Advisory
                </CardTitle>
              </CardHeader>
            </Card>
          </Link>

        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Card>
            <CardContent className="text-center">
              <p className="text-2xl">{history.length}</p>
              <p>Total Activity</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="text-center">
              <p className="text-2xl">{0}°C</p>
              <p>Temp</p>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}