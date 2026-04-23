 "use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "../context/UserContext";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import {
  Sprout,
  Home,
  Search,
  MessageCircle,
  History,
  Leaf,
  Users,
  LogOut,
  Menu,
  FileText,
} from "lucide-react";

export function MainLayout({ children }: { children?: ReactNode }) {
  const { user, logout, isAuthenticated } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!isAuthenticated) {
    return null;
  }

  const navItems = [
    { path: "/", label: "Dashboard", icon: Home },
    { path: "/disease-detection", label: "Disease Detection", icon: Search, highlight: true },
    { path: "/plant-recommendation", label: "Recommendations", icon: Sprout },
    { path: "/crop-advisory", label: "Crop Advisory", icon: FileText },
    { path: "/chatbot", label: "AI Assistant", icon: MessageCircle },
    { path: "/memory", label: "History", icon: History },
    { path: "/plant-care", label: "Plant Care", icon: Leaf },
    { path: "/community", label: "Community", icon: Users },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-green-600 rounded-lg flex items-center justify-center">
            <Sprout className="size-6 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-lg">AgroMind</h1>
            <p className="text-xs text-gray-600">Urban Gardening AI</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link key={item.path} href={item.path}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={`w-full justify-start relative ${
                  item.highlight ? "bg-green-50 hover:bg-green-100 border-2 border-green-500" : ""
                }`}
              >
                <Icon className={`size-4 mr-3 ${item.highlight ? "text-green-600" : ""}`} />
                <span className={item.highlight ? "font-semibold text-green-700" : ""}>
                  {item.label}
                </span>
                {item.highlight && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 size-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 mb-3 p-2">
          <div className="size-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-green-700">
              {user?.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-gray-600 truncate">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            logout();
            router.push("/signin");
          }}
        >
          <LogOut className="size-4 mr-2" />
          Logout
        </Button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 bg-white border-r border-gray-200 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="size-8 bg-green-600 rounded-lg flex items-center justify-center">
            <Sprout className="size-5 text-white" />
          </div>
          <h1 className="font-semibold text-lg">AgroMind</h1>
        </div>
        
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="flex flex-col h-full">
              <SidebarContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto lg:mt-0 mt-16">
        {children}
      </div>
    </div>
  );
}
