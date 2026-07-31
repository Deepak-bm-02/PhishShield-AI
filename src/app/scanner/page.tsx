"use client";
import React, { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, Button } from '@/components/ui';
import { AnalysisResult } from '@/features/scanner/components/AnalysisResult';
import { analyzeEmail, analyzeUrl } from '@/lib/api/analyze';
import { ThreatReport } from '@/types';
import { Loader2 } from 'lucide-react';
import { DEMO_DATA } from '@/lib/demo-data';

export default function ScannerPage() {
  const [tab, setTab] = useState<'email'|'url'|'screenshot'|'qr'>('email');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatReport | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    try {
      let res;
      if (tab === 'email') res = await analyzeEmail(input);
      else if (tab === 'url') res = await analyzeUrl(input);
      // For images, we would handle file upload here. 
      // For hackathon mock, we will just use the Demo data if input is empty
      else res = DEMO_DATA[0]; 
      
      setResult(res as ThreatReport);
    } catch (e: any) {
      setError(e.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setResult(DEMO_DATA[0]);
  };

  return (
    <AppLayout>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Security Scanner</h1>
          <p className="text-neutral">Analyze potential threats instantly using AI.</p>
        </div>
        <Button variant="secondary" onClick={loadDemo}>Load Demo Data</Button>
      </div>

      <Card className="mb-8">
        <div className="flex gap-4 border-b border-border pb-4 mb-6">
          {['email', 'url', 'screenshot', 'qr'].map(t => (
            <button 
              key={t}
              onClick={() => { setTab(t as any); setResult(null); setInput(''); }}
              className={`font-medium transition-colors ${tab === t ? 'text-primary border-b-2 border-primary -mb-[17px]' : 'text-neutral hover:text-foreground'}`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Paste your ${tab} content here...`}
            className="w-full h-32 bg-background border border-border rounded-lg p-4 text-foreground focus:outline-none focus:border-primary resize-none"
          />
          
          {error && <div className="text-danger text-sm">{error}</div>}

          <div className="flex justify-end">
            <Button onClick={handleAnalyze} disabled={loading || (!input && tab !== 'screenshot' && tab !== 'qr')}>
              {loading ? <Loader2 className="animate-spin" /> : 'Analyze Threat'}
            </Button>
          </div>
        </div>
      </Card>

      {result && <AnalysisResult report={result} />}
    </AppLayout>
  );
}
