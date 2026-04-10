import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=25.3176&lon=82.9739&appid=${process.env.WEATHER_API_KEY}&units=metric`
  );

  const data = await res.json();

  return NextResponse.json(data);
}