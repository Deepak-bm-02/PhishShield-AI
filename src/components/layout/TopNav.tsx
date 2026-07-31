"use client";
import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { Bell, Search, User, CheckCircle2, FileText, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockNotifications = [
  { id: 1, type: "success", title: "Scan Completed", desc: "URL Analysis finished. Verdict: Safe.", time: "2m ago", icon: CheckCircle2 },
  { id: 2, type: "info", title: "Report Exported", desc: "JSON report downloaded successfully.", time: "1hr ago", icon: FileText },
  { id: 3, type: "warning", title: "Suspicious Activity", desc: "Email scanner detected brand impersonation.", time: "3hr ago", icon: AlertTriangle },
];

export function TopNav() {
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search reports... (Ctrl+K)" 
            className="w-full bg-zinc-900 border border-zinc-800 rounded-full pl-10 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors placeholder:text-zinc-500"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-zinc-400 hover:text-zinc-100 rounded-full hover:bg-zinc-900 transition-colors relative"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full ring-2 ring-zinc-950"></span>
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute right-0 mt-2 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50"
              >
                <div className="px-4 py-3 border-b border-zinc-800 flex justify-between items-center">
                  <h3 className="font-semibold text-zinc-100">Notifications</h3>
                  <button className="text-xs text-blue-400 hover:text-blue-300">Mark all read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {mockNotifications.map((notif) => (
                    <div key={notif.id} className="p-4 border-b border-zinc-800/50 hover:bg-zinc-800/50 transition-colors cursor-pointer flex gap-3">
                      <div className={`mt-0.5 ${notif.type === 'success' ? 'text-emerald-400' : notif.type === 'warning' ? 'text-amber-400' : 'text-blue-400'}`}>
                        <notif.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{notif.title}</p>
                        <p className="text-xs text-zinc-400 mt-1">{notif.desc}</p>
                        <p className="text-[10px] text-zinc-500 mt-2">{notif.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm hover:ring-2 hover:ring-blue-500 hover:ring-offset-2 hover:ring-offset-zinc-950 transition-all">
          <User className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
}
