"use client";
import React, { useState } from 'react';
import { Card, Button, ScanProgressTimeline } from '@/components/ui';
import { AnalysisResult } from '@/features/scanner/components/AnalysisResult';
import { ThreatReport } from '@/types';
import { useToast } from '@/providers';
import { DEMO_DATA } from '@/lib/demo-data';
import { AppShell } from '@/components/layout/AppShell';
import { StorageService } from '@/lib/storage';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

interface ScannerFrameworkProps {
  title: string;
  description: string;
  scanType: 'email' | 'url' | 'screenshot' | 'qr';
  analyzeAction: (payload: any) => Promise<ThreatReport>;
  inputComponent: (props: { value: any; onChange: (val: any) => void; error?: string }) => React.ReactNode;
  validateInput?: (value: any) => string | null;
  isImage?: boolean;
}

export function ScannerFramework({ title, description, scanType, analyzeAction, inputComponent, validateInput, isImage }: ScannerFrameworkProps) {
  const [input, setInput] = useState<any>('');
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ThreatReport | null>(null);
  const [pendingResult, setPendingResult] = useState<ThreatReport | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setError(undefined);
    if (!input && !isImage) {
      setError("Input cannot be empty.");
      return;
    }
    if (validateInput) {
      const valError = validateInput(input);
      if (valError) {
        setError(valError);
        return;
      }
    }

    setLoading(true);
    setResult(null);
    setPendingResult(null);

    try {
      let res;
      if (!input && isImage) {
        res = DEMO_DATA[0];
      } else {
        res = await analyzeAction(input);
      }
      setPendingResult(res as ThreatReport);
      // Timeline will call onComplete which sets Result.
    } catch (e: any) {
      toast({ type: 'error', title: 'Analysis Failed', description: e.message || 'Something went wrong.' });
      setLoading(false);
    }
  };

  const loadDemo = () => {
    setLoading(true);
    setResult(null);
    setPendingResult(null);
    setTimeout(() => {
      setPendingResult(DEMO_DATA[0]);
    }, 100);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-neutral">{description}</p>
        </div>
        <Button variant="secondary" onClick={loadDemo}>Load Demo</Button>
      </div>

      {!loading && !result && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6">
            <div className="flex flex-col gap-4">
              {inputComponent({ value: input, onChange: setInput, error })}
              
              <div className="flex justify-end mt-4">
                <Button onClick={handleAnalyze} disabled={!input && !isImage} size="lg">
                  Analyze Threat
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="p-6">
          <ScanProgressTimeline 
            onComplete={() => {
              if (pendingResult) {
                setResult(pendingResult);
                StorageService.saveAnalysis(pendingResult, scanType);
                setLoading(false);
                toast({ type: 'success', title: 'Analysis Complete', description: 'Threat report generated successfully.' });
              }
            }} 
          />
        </Card>
      )}

      {result && !loading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col gap-6"
        >
          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
            <ShieldCheck className="h-6 w-6" />
            <h2 className="text-lg font-semibold text-emerald-100">Threat Analysis Complete</h2>
          </div>
          <AnalysisResult report={result} />
          
          <div className="flex justify-center mt-4">
            <Button variant="outline" onClick={() => { setResult(null); setInput(''); }}>
              Analyze Another
            </Button>
          </div>
        </motion.div>
      )}
      </div>
    </AppShell>
  );
}
