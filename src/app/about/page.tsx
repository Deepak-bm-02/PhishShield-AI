"use client";
import React, { useEffect, useState } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card } from '@/components/ui';
import { fetchHealth } from '@/lib/api/health';
import { Activity, ShieldCheck, Server } from 'lucide-react';

export default function AboutPage() {
  const [health, setHealth] = useState<any>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(console.error);
  }, []);

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">About PhishShield AI</h1>
        <p className="text-neutral">System diagnostics and version information.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <ShieldCheck className="h-8 w-8 text-blue-500" />
            <h2 className="text-2xl font-bold">Version Info</h2>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-neutral">Product</span>
              <span className="font-medium">PhishShield AI</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-neutral">Version</span>
              <span className="font-medium">{health?.version || '0.1.0'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-neutral">Environment</span>
              <span className="font-medium">{health?.environment || 'production'}</span>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <span className="text-neutral">Core Architecture</span>
              <span className="font-medium">Next.js + Gemini</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="h-8 w-8 text-emerald-500" />
            <h2 className="text-2xl font-bold">System Health</h2>
          </div>
          {health ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-neutral">Backend API</span>
                <span className="font-medium text-emerald-400 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-400" /> {health.status}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-neutral">Uptime</span>
                <span className="font-medium">{Math.floor(health.uptime / 60)} minutes</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-neutral">Last Checked</span>
                <span className="font-medium">{new Date(health.timestamp).toLocaleTimeString()}</span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-neutral">
              <Server className="h-5 w-5 animate-pulse" /> Loading diagnostics...
            </div>
          )}
        </Card>
        
        <Card className="md:col-span-2 p-6 bg-blue-50/50 border-blue-200">
          <h3 className="text-lg font-semibold text-blue-400 mb-2">Hackathon Project Statement</h3>
          <p className="text-neutral leading-relaxed">
            PhishShield AI was developed as a next-generation security operations center designed to protect users against zero-day phishing attacks, credential harvesting, and malware delivery mechanisms using the power of Google&apos;s Gemini Large Language Models.
          </p>
        </Card>
      </div>
    </AppShell>
  );
}
