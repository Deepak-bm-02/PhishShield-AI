"use client";
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Button, AlertDialog } from '@/components/ui';
import { useTheme, useToast } from '@/providers';
import { Moon, Sun, Bell, Shield, Save, RotateCcw } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [notifications, setNotifications] = useLocalStorage<boolean>('phishshield-notifications', true);
  const [dataSharing, setDataSharing] = useLocalStorage<boolean>('phishshield-data-sharing', false);
  const [animations, setAnimations] = useLocalStorage<boolean>('phishshield-animations', true);
  
  const [showResetDialog, setShowResetDialog] = useState(false);

  const handleSave = () => {
    toast({ type: 'success', title: 'Settings Saved', description: 'Your preferences have been updated locally.' });
  };

  const handleReset = () => {
    if (theme === 'dark') toggleTheme(); // reset to light
    setNotifications(true);
    setDataSharing(false);
    setAnimations(true);
    
    // Clear the phishshield-theme from storage if needed or just leave light
    localStorage.removeItem('phishshield-theme');
    
    toast({ type: 'success', title: 'Settings Reset', description: 'Your preferences have been restored to defaults.' });
  };

  return (
    <AppShell>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-zinc-400">Manage your application preferences.</p>
        </div>
        <Button variant="secondary" onClick={() => setShowResetDialog(true)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
          <RotateCcw className="h-4 w-4 mr-2" /> Reset to Defaults
        </Button>
      </div>

      <div className="max-w-2xl space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-100"><Moon className="h-5 w-5 text-blue-400" /> Appearance</h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-zinc-100">Dark Mode</p>
                <p className="text-sm text-zinc-400">Toggle dark mode on or off.</p>
              </div>
              <Button variant={theme === 'dark' ? 'primary' : 'secondary'} onClick={toggleTheme}>
                {theme === 'dark' ? <Moon className="h-4 w-4 mr-2" /> : <Sun className="h-4 w-4 mr-2" />}
                {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
              </Button>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <div>
                <p className="font-medium text-zinc-100">UI Animations</p>
                <p className="text-sm text-zinc-400">Enable micro-animations and transitions.</p>
              </div>
              <button 
                onClick={() => setAnimations(!animations)}
                className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${animations ? 'bg-blue-600' : 'bg-zinc-700'}`}
              >
                <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${animations ? 'translate-x-6' : ''}`} />
              </button>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-100"><Bell className="h-5 w-5 text-emerald-400" /> Notifications</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-100">Toast Notifications</p>
              <p className="text-sm text-zinc-400">Show popup notifications for events.</p>
            </div>
            <button 
              onClick={() => setNotifications(!notifications)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${notifications ? 'bg-emerald-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-zinc-100"><Shield className="h-5 w-5 text-purple-400" /> Privacy</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-zinc-100">Telemetry Data</p>
              <p className="text-sm text-zinc-400">Share anonymous scan data to improve AI models.</p>
            </div>
            <button 
              onClick={() => setDataSharing(!dataSharing)}
              className={`w-12 h-6 rounded-full transition-colors relative focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-900 ${dataSharing ? 'bg-purple-600' : 'bg-zinc-700'}`}
            >
              <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${dataSharing ? 'translate-x-6' : ''}`} />
            </button>
          </div>
        </Card>

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} size="lg"><Save className="h-4 w-4 mr-2" /> Save Preferences</Button>
        </div>
      </div>

      <AlertDialog 
        isOpen={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        onConfirm={handleReset}
        title="Reset Settings"
        description="Are you sure you want to reset all application settings to their default values?"
        confirmText="Reset Defaults"
        isDestructive={true}
      />
    </AppShell>
  );
}
