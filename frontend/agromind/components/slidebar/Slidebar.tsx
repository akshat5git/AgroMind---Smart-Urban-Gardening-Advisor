"use client";

import {
  Home, Bot, Leaf, Activity, Sprout, Stethoscope, Bell, Network, LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Ask AI", href: "/chatbot/view", icon: Bot },
  { name: "Gardens", href: "/garden/list", icon: Leaf },
  { name: "Detect", href: "/detect/view", icon: Activity },
  { name: "Advisory", href: "/dashboard/advisory", icon: Stethoscope },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Community", href: "/community", icon: Network },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <aside className="hidden lg:flex w-72 flex-col bg-white border-r fixed inset-y-0 z-30">

      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b">
        🌱 <span className="text-xl font-bold">AgroMind</span>
      </div>

      {/* Nav */}
      <div className="flex-1 p-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;

          return (
            <Link key={item.name} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition
                ${active ? "bg-green-100 text-green-700" : "hover:bg-gray-100"}
              `}>
                <Icon size={18} />
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>

      {/* User */}
      <div className="p-4 border-t">
        <p className="text-sm">{session?.user?.email}</p>
        <button
          onClick={() => signOut()}
          className="mt-2 text-red-600 text-sm"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
