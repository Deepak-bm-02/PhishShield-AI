"use client";
import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Badge } from '@/components/ui';
import { fetchHistory } from '@/lib/api/history';
import { HistoryRecord } from '@/types';
import { Search } from 'lucide-react';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchHistory().then(setHistory);
  }, []);

  const filtered = history.filter(h => 
    h.scanType.includes(search.toLowerCase()) || 
    h.verdict.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppLayout>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Threat History</h1>
          <p className="text-neutral">Review past scans and analysis reports.</p>
        </div>
        
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 text-neutral" size={18} />
          <input 
            type="text" 
            placeholder="Search scans..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:border-primary"
          />
        </div>
      </div>

      <Card>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-neutral">No history records found.</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(record => (
              <div key={record.id} className="flex justify-between items-center p-4 bg-background border border-border rounded-lg hover:border-primary transition-colors cursor-pointer">
                <div className="flex gap-4 items-center">
                  <Badge variant={record.riskScore > 50 ? 'danger' : 'success'}>{record.verdict}</Badge>
                  <div>
                    <p className="font-semibold">{record.scanType.toUpperCase()} Scan</p>
                    <p className="text-xs text-neutral">{new Date(record.timestamp).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-bold">{record.riskScore}</span>
                  <span className="text-xs text-neutral ml-1">Score</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </AppLayout>
  );
}
