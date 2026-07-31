"use client";
import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Mail, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  QrCode, 
  Bot, 
  History, 
  Settings, 
  Info,
  ShieldCheck
} from "lucide-react";
import { cn } from "../../lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/email", label: "Email Scanner", icon: Mail },
  { href: "/url", label: "URL Scanner", icon: LinkIcon },
  { href: "/screenshot", label: "Screenshot Scanner", icon: ImageIcon },
  { href: "/qr", label: "QR Scanner", icon: QrCode },
  { href: "/assistant", label: "AI Assistant", icon: Bot },
  { href: "/history", label: "Threat History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/about", label: "About", icon: Info },
];

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside className={cn("flex flex-col w-64 bg-background border-r border-border text-neutral", className)}>
      <div className="flex items-center gap-3 p-6 font-bold text-xl text-foreground">
        <ShieldCheck className="h-7 w-7 text-blue-500" />
        <span>PhishShield AI</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "hover:bg-card hover:text-foreground"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive ? "text-blue-500" : "text-neutral")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="bg-card p-3 rounded-lg border border-border">
          <p className="text-xs text-neutral mb-1">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-sm text-neutral font-medium">All Systems Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
