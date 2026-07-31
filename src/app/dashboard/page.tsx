"use client";
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card } from '@/components/ui';
import { fetchHistory } from '@/lib/api/history';
import { HistoryRecord } from '@/types';
import { ShieldCheck, ShieldAlert, Activity } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function DashboardPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  const totalScans = history.length;
  const threatCount = history.filter(h => h.riskScore > 50).length;
  const safeCount = totalScans - threatCount;
  const protectionScore = totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 100;

  const data = [
    { name: 'Safe', value: safeCount, color: '#22c55e' },
    { name: 'Threats', value: threatCount, color: '#ef4444' }
  ];

  return (
    <AppLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Security Operations Dashboard</h1>
        <p className="text-neutral">Live threat intelligence overview.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary"><Activity size={24} /></div>
          <div>
            <p className="text-neutral text-sm">Total Scans</p>
            <p className="text-3xl font-bold">{totalScans}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-success/10 rounded-full text-success"><ShieldCheck size={24} /></div>
          <div>
            <p className="text-neutral text-sm">Protection Score</p>
            <p className="text-3xl font-bold">{protectionScore}%</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-4 bg-danger/10 rounded-full text-danger"><ShieldAlert size={24} /></div>
          <div>
            <p className="text-neutral text-sm">Threats Detected</p>
            <p className="text-3xl font-bold">{threatCount}</p>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h2 className="font-semibold text-lg mb-4">Threat Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {data.map((entry, index) => (
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {history.map(record => (
              <div key={record.id} className="flex justify-between items-center pb-4 border-b border-border last:border-0">
                <div>
                  <p className="font-medium">{record.scanType.toUpperCase()} Scan</p>
                  <p className="text-xs text-neutral">{new Date(record.timestamp).toLocaleString()}</p>
                </div>
                <span className={\`text-sm font-semibold \${record.riskScore > 50 ? 'text-danger' : 'text-success'}\`}>
                  {record.verdict}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AppLayout>
  );
}
