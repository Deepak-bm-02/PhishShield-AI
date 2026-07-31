"use client";
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/AppShell';
import { Button, Skeleton } from '@/components/ui';
import { fetchHistory } from '@/lib/api/history';
import { ThreatReport } from '@/types';
import { ArrowLeft, Download, Printer, ShieldAlert } from 'lucide-react';
import { AnalysisResult } from '@/features/scanner/components/AnalysisResult';

export default function ReportViewerPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [report, setReport] = useState<ThreatReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchHistory().then(data => {
      // Find the record and cast it to ThreatReport format (assuming HistoryRecord matches ThreatReport structure for this demo)
      const record = data.find(r => r.id === id);
      if (record) {
        setReport({
          riskScore: record.riskScore,
          verdict: record.verdict,
          summary: record.summary,
          threatType: record.threatType || 'None',
          indicators: (record as any).indicators || [],
          recommendations: (record as any).recommendations || []
        } as ThreatReport);
      }
      setLoading(false);
    });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report_${id}.json`;
    a.click();
  };

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </AppShell>
    );
  }

  if (!report) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto text-center py-20">
          <ShieldAlert className="h-16 w-16 text-zinc-700 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Not Found</h1>
          <p className="text-neutral mb-6">The threat report you are looking for does not exist or was deleted.</p>
          <Button onClick={() => router.push('/history')}>Back to History</Button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex justify-between items-end print:hidden">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center text-sm text-neutral hover:text-foreground mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </button>
            <h1 className="text-3xl font-bold">Threat Report</h1>
            <p className="text-neutral">ID: {id}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleDownload}><Download className="h-4 w-4 mr-2" /> JSON</Button>
            <Button onClick={handlePrint}><Printer className="h-4 w-4 mr-2" /> Print PDF</Button>
          </div>
        </div>

        <div className="print:block">
          <div className="hidden print:block mb-8 border-b border-zinc-200 pb-4">
            <h1 className="text-2xl font-bold text-black">PhishShield AI - Threat Report</h1>
            <p className="text-sm text-gray-500">ID: {id} | Generated: {new Date().toLocaleString()}</p>
          </div>
          
          <AnalysisResult report={report} />
        </div>
      </div>
    </AppShell>
  );
}
