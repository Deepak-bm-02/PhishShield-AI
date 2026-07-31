"use client";
import React, { useEffect, useState, useMemo } from 'react';
import { ClientOnly } from '@/components/ClientOnly';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Button, Skeleton } from '@/components/ui';
import { StorageService } from '@/lib/storage';
import { HistoryRecord } from '@/types';
import { ShieldCheck, Activity, FileJson, FileText, DownloadCloud } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, RadialBarChart, RadialBar, Legend } from 'recharts';

export default function ThreatIntelligenceCenter() {
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [scanTypeFilter, setScanTypeFilter] = useState<string>('all');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  useEffect(() => {
    // Initial load
    setHistory(StorageService.getHistory());
    setLoading(false);

    // Subscribe to changes
    const unsubscribe = StorageService.subscribe(() => {
      setHistory(StorageService.getHistory());
    });

    return unsubscribe;
  }, []);

  const filteredHistory = useMemo(() => {
    return history.filter(h => {
      const matchType = scanTypeFilter === 'all' || h.scanType === scanTypeFilter;
      const matchSeverity = severityFilter === 'all' || (severityFilter === 'safe' ? h.riskScore <= 30 : h.riskScore > 30);
      return matchType && matchSeverity;
    });
  }, [history, scanTypeFilter, severityFilter]);

  // Metrics
  const totalScans = filteredHistory.length;
  const threatCount = filteredHistory.filter(h => h.riskScore > 30).length;
  const safeCount = totalScans - threatCount;
  const protectionScore = totalScans > 0 ? Math.round((safeCount / totalScans) * 100) : 100;
  const avgRisk = totalScans > 0 ? Math.round(filteredHistory.reduce((acc, h) => acc + h.riskScore, 0) / totalScans) : 0;

  // Chart Data: Threat Distribution (Scan Types)
  const scanTypes = ['email', 'url', 'screenshot', 'qr'];
  const distributionData = scanTypes.map(type => ({
    name: type.charAt(0).toUpperCase() + type.slice(1),
    value: filteredHistory.filter(h => h.scanType === type).length
  })).filter(d => d.value > 0);

  const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

  // Chart Data: Severity
  const severityData = [
    { name: 'Safe', value: filteredHistory.filter(h => h.verdict === 'Safe').length, fill: '#10b981' },
    { name: 'Low', value: filteredHistory.filter(h => h.verdict === 'Low Risk').length, fill: '#3b82f6' },
    { name: 'Suspicious', value: filteredHistory.filter(h => h.verdict === 'Suspicious').length, fill: '#f59e0b' },
    { name: 'High', value: filteredHistory.filter(h => h.verdict === 'High Risk').length, fill: '#ef4444' }
  ].filter(d => d.value > 0);

  // Chart Data: Categories
  const categoryMap: Record<string, number> = {};
  filteredHistory.forEach(h => {
    if (h.threatType && h.threatType !== 'None') {
      categoryMap[h.threatType] = (categoryMap[h.threatType] || 0) + 1;
    }
  });
  const categoryData = Object.keys(categoryMap).map(k => ({ name: k, count: categoryMap[k] })).sort((a, b) => b.count - a.count).slice(0, 5);

  // Recommendations
  const generateRecommendations = () => {
    const recs = [];
    if (threatCount > totalScans * 0.3) recs.push('Enable Multi-Factor Authentication immediately.');
    if (categoryData.find(c => c.name.includes('Phishing'))) recs.push('Conduct employee phishing awareness training.');
    if (categoryData.find(c => c.name.includes('Credential'))) recs.push('Rotate potentially compromised credentials.');
    if (recs.length === 0) recs.push('Maintain current security posture.', 'Keep systems and browsers updated.');
    return recs;
  };

  const recommendations = generateRecommendations();

  // Export Functions
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(filteredHistory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'threat_report.json';
    a.click();
  };

  const exportCSV = () => {
    const headers = ['ID,ScanType,Timestamp,RiskScore,Verdict,ThreatType,Summary'];
    const rows = filteredHistory.map(h => `${h.id},${h.scanType},${h.timestamp},${h.riskScore},${h.verdict},${h.threatType || 'None'},"${h.summary}"`);
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'threat_report.csv';
    a.click();
  };

  const exportPDF = () => {
    window.print();
  };

  if (loading) return (
    <AppShell>
      <div className="flex flex-col md:flex-row justify-between mb-8">
        <div><Skeleton className="h-10 w-64 mb-2" /><Skeleton className="h-4 w-96" /></div>
        <div className="flex gap-2"><Skeleton className="h-10 w-24" /><Skeleton className="h-10 w-24" /></div>
      </div>
      <div className="flex gap-4 mb-8"><Skeleton className="h-10 w-32" /><Skeleton className="h-10 w-32" /></div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" />
      </div>
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Skeleton className="h-64 w-full" /><Skeleton className="md:col-span-2 h-64 w-full" />
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Threat Intelligence Center</h1>
          <p className="text-neutral">Comprehensive security insights and reporting.</p>
        </div>
        <div className="flex gap-2 print:hidden">
          <Button variant="secondary" onClick={exportCSV}><DownloadCloud className="w-4 h-4 mr-2" /> CSV</Button>
          <Button variant="secondary" onClick={exportJSON}><FileJson className="w-4 h-4 mr-2" /> JSON</Button>
          <Button onClick={exportPDF}><FileText className="w-4 h-4 mr-2" /> PDF Report</Button>
        </div>
      </div>

      <div className="flex gap-4 mb-8 print:hidden">
        <select 
          className="bg-card border border-border rounded p-2 text-foreground"
          value={scanTypeFilter}
          onChange={e => setScanTypeFilter(e.target.value)}
        >
          <option value="all">All Scan Types</option>
          <option value="email">Email</option>
          <option value="url">URL</option>
          <option value="qr">QR Code</option>
          <option value="screenshot">Screenshot</option>
        </select>

        <select 
          className="bg-card border border-border rounded p-2 text-foreground"
          value={severityFilter}
          onChange={e => setSeverityFilter(e.target.value)}
        >
          <option value="all">All Severities</option>
          <option value="safe">Safe Only</option>
          <option value="threats">Threats Only</option>
        </select>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        <Card className="flex flex-col justify-center">
          <p className="text-neutral text-sm mb-1">Total Scans</p>
          <p className="text-3xl font-bold">{totalScans}</p>
        </Card>
        <Card className="flex flex-col justify-center">
          <p className="text-neutral text-sm mb-1">Safe Scans</p>
          <p className="text-3xl font-bold text-success">{safeCount}</p>
        </Card>
        <Card className="flex flex-col justify-center">
          <p className="text-neutral text-sm mb-1">Detected Threats</p>
          <p className="text-3xl font-bold text-danger">{threatCount}</p>
        </Card>
        <Card className="flex flex-col justify-center">
          <p className="text-neutral text-sm mb-1">Average Risk</p>
          <p className="text-3xl font-bold text-warning">{avgRisk}/100</p>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Security Score Gauge */}
        <Card className="flex flex-col items-center justify-center text-center">
          <h2 className="font-semibold text-lg w-full text-left mb-4">Security Score</h2>
          <div className="h-48 w-full relative flex items-center justify-center">
            <ClientOnly fallback={<div className="h-full w-full bg-card/50 rounded-full animate-pulse" />}>
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart 
                cx="50%" cy="50%" 
                innerRadius="70%" outerRadius="100%" 
                barSize={20} data={[{ name: 'Score', value: protectionScore, fill: protectionScore > 80 ? '#10b981' : protectionScore > 50 ? '#f59e0b' : '#ef4444' }]} 
                startAngle={180} endAngle={0}
              >
                <RadialBar background dataKey="value" cornerRadius={10} />
              </RadialBarChart>
            </ResponsiveContainer>
            </ClientOnly>
            <div className="absolute flex flex-col items-center justify-center pb-6">
              <span className="text-4xl font-bold">{protectionScore}</span>
              <span className="text-sm text-neutral">/ 100</span>
            </div>
          </div>
          <p className="text-sm text-neutral mt-2">Overall organizational security posture.</p>
        </Card>

        {/* Severity Distribution */}
        <Card className="md:col-span-2">
          <h2 className="font-semibold text-lg mb-4">Severity Distribution</h2>
          <div className="h-48">
            <ClientOnly fallback={<div className="h-full w-full bg-card/50 animate-pulse" />}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={severityData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={80} tick={{fill: '#888'}} axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e1e24', border: 'none', borderRadius: '8px'}} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                  {severityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Threat Distribution */}
        <Card>
          <h2 className="font-semibold text-lg mb-4">Scan Distribution</h2>
          <div className="h-64">
            <ClientOnly fallback={<div className="h-full w-full bg-card/50 animate-pulse" />}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie data={distributionData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#1e1e24', border: 'none', borderRadius: '8px'}} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            </ClientOnly>
          </div>
        </Card>

        {/* Threat Categories */}
        <Card>
          <h2 className="font-semibold text-lg mb-4">Top Threat Categories</h2>
          <div className="h-64">
            <ClientOnly fallback={<div className="h-full w-full bg-card/50 animate-pulse" />}>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <XAxis dataKey="name" tick={{fontSize: 12, fill: '#888'}} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#1e1e24', border: 'none', borderRadius: '8px'}} />
                  <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-neutral">No threats detected yet.</div>
              )}
            </ClientOnly>
          </div>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <h2 className="font-semibold text-lg mb-4">Recommendations</h2>
          <ul className="space-y-4">
            {recommendations.map((rec, i) => (
              <li key={i} className="flex gap-3 items-start p-3 bg-white/5 rounded-lg border border-white/5">
                <ShieldCheck className="text-primary w-5 h-5 shrink-0" />
                <span className="text-sm">{rec}</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="md:col-span-2 overflow-hidden flex flex-col">
          <h2 className="font-semibold text-lg mb-4">Threat Timeline</h2>
          <div className="flex-1 overflow-y-auto max-h-[300px] pr-2 space-y-4">
            {filteredHistory.length > 0 ? filteredHistory.map(record => (
              <div key={record.id} className="flex justify-between items-start pb-4 border-b border-border last:border-0 relative before:absolute before:left-[11px] before:top-6 before:bottom-[-20px] before:w-[2px] before:bg-border last:before:hidden">
                <div className="flex gap-4">
                  <div className={`w-6 h-6 rounded-full mt-0.5 flex items-center justify-center z-10 shrink-0 ${record.riskScore > 60 ? 'bg-danger text-white' : record.riskScore > 30 ? 'bg-warning text-white' : 'bg-success text-white'}`}>
                    <Activity size={12} />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{record.scanType.toUpperCase()} Analysis</p>
                    <p className="text-xs text-neutral mb-1">{new Date(record.timestamp).toLocaleString()}</p>
                    <p className="text-sm">{record.summary}</p>
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full ${record.riskScore > 60 ? 'bg-danger/20 text-danger' : record.riskScore > 30 ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                    {record.verdict}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-neutral text-center py-8">No events match the current filters.</div>
            )}
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
