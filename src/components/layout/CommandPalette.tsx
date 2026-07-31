"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mail, Link as LinkIcon, Image as ImageIcon, QrCode, LayoutDashboard, History, Settings } from "lucide-react";
import { Dialog } from "../ui/dialog";

const actions = [
  { id: "dashboard", name: "Dashboard", shortcut: ["G", "D"], href: "/dashboard", icon: LayoutDashboard },
  { id: "email", name: "Email Scanner", shortcut: ["S", "E"], href: "/email", icon: Mail },
  { id: "url", name: "URL Scanner", shortcut: ["S", "U"], href: "/url", icon: LinkIcon },
  { id: "screenshot", name: "Screenshot Scanner", shortcut: ["S", "I"], href: "/screenshot", icon: ImageIcon },
  { id: "qr", name: "QR Scanner", shortcut: ["S", "Q"], href: "/qr", icon: QrCode },
  { id: "history", name: "Threat History", shortcut: ["G", "H"], href: "/history", icon: History },
  { id: "settings", name: "Settings", shortcut: ["G", "S"], href: "/settings", icon: Settings },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredActions = query === ""
    ? actions
    : actions.filter((action) =>
        action.name.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <Dialog isOpen={open} onClose={() => setOpen(false)} title="Command Palette" description="Search actions or navigate quickly." className="max-w-2xl">
      <div className="flex items-center px-4 border-b border-border">
        <Search className="h-5 w-5 text-neutral mr-3" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent border-0 py-4 focus:ring-0 focus:outline-none text-foreground placeholder:text-neutral"
          placeholder="Type a command or search..."
        />
        <kbd className="hidden sm:inline-block px-2 py-1 bg-card text-neutral rounded text-xs">ESC</kbd>
      </div>
      <div className="max-h-[300px] overflow-y-auto p-2">
        {filteredActions.length === 0 ? (
          <p className="p-4 text-center text-neutral text-sm">No results found.</p>
        ) : (
          filteredActions.map((action) => (
            <button
              key={action.id}
              onClick={() => {
                router.push(action.href);
                setOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-card rounded-lg text-left transition-colors"
            >
              <div className="flex items-center gap-3 text-neutral">
                <action.icon className="h-4 w-4" />
                <span>{action.name}</span>
              </div>
              <div className="flex gap-1">
                {action.shortcut.map((key) => (
                  <kbd key={key} className="px-2 py-1 bg-card text-neutral rounded text-xs">{key}</kbd>
                ))}
              </div>
            </button>
          ))
        )}
      </div>
    </Dialog>
  );
}
