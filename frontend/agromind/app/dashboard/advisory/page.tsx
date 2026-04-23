"use client";

import Link from "next/link";
import {
  CloudSun,
  Droplets,
  Leaf,
  ShieldCheck,
  Sprout,
  Thermometer,
} from "lucide-react";
import Sidebar from "@/components/slidebar/Slidebar";

const advisoryCards = [
  {
    title: "Morning Watering Window",
    description:
      "Water early to reduce evaporation and give roots time to absorb moisture before midday heat.",
    icon: Droplets,
    accent: "bg-emerald-100 text-emerald-700",
  },
  {
    title: "Weekly Health Scan",
    description:
      "Inspect the underside of leaves and new shoots once a week to catch disease and pests early.",
    icon: ShieldCheck,
    accent: "bg-lime-100 text-lime-700",
  },
  {
    title: "Rotate Container Crops",
    description:
      "Move heavy feeders and herbs between beds or containers each cycle to reduce nutrient stress.",
    icon: Sprout,
    accent: "bg-amber-100 text-amber-700",
  },
];

const checklist = [
  "Check soil moisture before adding more water.",
  "Remove yellow or spotted leaves to limit disease spread.",
  "Use mulch where possible to keep roots cooler and conserve moisture.",
  "Review sunlight exposure after each weather shift or season change.",
];

export default function AdvisoryPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <Sidebar />

      <main className="px-4 py-6 lg:ml-72 lg:px-8">
        <section className="overflow-hidden rounded-[32px] bg-gradient-to-br from-emerald-700 via-emerald-600 to-lime-500 p-8 text-white shadow-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm backdrop-blur">
              <Leaf className="size-4" />
              Daily crop guidance
            </div>

            <h1 className="text-3xl font-semibold sm:text-4xl">
              Keep your garden healthier with a simple advisory routine.
            </h1>

            <p className="max-w-2xl text-sm text-emerald-50 sm:text-base">
              These suggestions are tuned for small urban gardens and container setups,
              so you can stay consistent even when weather and plant health change.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/garden/list"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-emerald-700 transition hover:bg-emerald-50"
              >
                Open my gardens
              </Link>
              <Link
                href="/detect/view"
                className="rounded-full border border-white/40 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                Run disease detection
              </Link>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-orange-100 p-3 text-orange-700">
                <Thermometer className="size-5" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Heat watch</p>
                <p className="font-semibold">Shade tender crops at peak sun</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-stone-600">
              Leafy greens and seedlings are the first to wilt. Use partial cover or
              shift movable pots when afternoon heat spikes.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-sky-100 p-3 text-sky-700">
                <CloudSun className="size-5" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Forecast habit</p>
                <p className="font-semibold">Adjust watering before rain</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-stone-600">
              Skip routine watering when rain is likely and improve drainage in
              containers to avoid soggy roots and fungal stress.
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-2xl bg-lime-100 p-3 text-lime-700">
                <Leaf className="size-5" />
              </div>
              <div>
                <p className="text-sm text-stone-500">Nutrition cue</p>
                <p className="font-semibold">Feed during active growth</p>
              </div>
            </div>
            <p className="text-sm leading-6 text-stone-600">
              Add compost or a balanced fertilizer when plants are pushing fresh
              growth, not when they are heat-stressed or recently transplanted.
            </p>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold">Recommended practices</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              {advisoryCards.map((item) => {
                const Icon = item.icon;

                return (
                  <article
                    key={item.title}
                    className="rounded-2xl border border-stone-200 p-4"
                  >
                    <div className={`inline-flex rounded-2xl p-3 ${item.accent}`}>
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 font-semibold">{item.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-stone-600">
                      {item.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-xl font-semibold">Quick checklist</h2>
            <div className="mt-4 space-y-3">
              {checklist.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-3 rounded-2xl bg-stone-50 px-4 py-3"
                >
                  <span className="mt-1 size-2 rounded-full bg-emerald-600" />
                  <p className="text-sm leading-6 text-stone-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
