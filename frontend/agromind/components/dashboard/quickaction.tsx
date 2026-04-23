import { Activity, Bot, FileText, Cloud } from "lucide-react";
import Link from "next/link";

const actions = [
  {
    title: "Detect Disease",
    desc: "Upload plant image",
    icon: Activity,
    href: "/detect/view",
    color: "bg-green-100",
  },
  {
    title: "Ask AI",
    desc: "Get instant answers",
    icon: Bot,
    href: "/chatbot/view",
    color: "bg-blue-100",
  },
  {
    title: "Advisory",
    desc: "Smart suggestions",
    icon: FileText,
    href: "/dashboard/advisory",
    color: "bg-purple-100",
  },
  {
    title: "Weather",
    desc: "Check forecast",
    icon: Cloud,
    href: "/dashboard",
    color: "bg-yellow-100",
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

      {actions.map((a) => {
        const Icon = a.icon;

        return (
          <Link key={a.title} href={a.href}>
            <div className={`${a.color} p-4 rounded-xl cursor-pointer hover:shadow-md`}>
              <Icon className="mb-2" />
              <p className="font-medium">{a.title}</p>
              <p className="text-xs text-gray-600">{a.desc}</p>
            </div>
          </Link>
        );
      })}

    </div>
  );
}
