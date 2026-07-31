import React from 'react';
import { Card, Badge } from '@/components/ui';
import { ThreatReport } from '@/types';
import { ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

export const AnalysisResult = ({ report }: { report: ThreatReport }) => {
  const getVariant = (verdict: string) => {
    if (verdict === 'Safe') return 'success';
    if (verdict === 'Low Risk') return 'neutral';
    if (verdict === 'Suspicious') return 'warning';
    return 'danger';
  };

  const Icon = report.verdict === 'Safe' ? ShieldCheck : report.verdict === 'High Risk' ? ShieldAlert : Shield;
  const variant = getVariant(report.verdict);
  
  return (
    <Card className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-start justify-between border-b border-border pb-4">
        <div className="flex items-center gap-4">
          <div className={\`p-3 rounded-full bg-\${variant}/10 text-\${variant}\`}>
            <Icon size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold">{report.verdict}</h2>
            <p className="text-neutral">{report.threatType}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-black">{report.riskScore}<span className="text-sm text-neutral font-normal">/100</span></div>
          <Badge variant={variant as any}>Risk Score</Badge>
        </div>
      </div>
      
      <div>
        <h3 className="font-semibold text-lg mb-2 text-foreground">AI Summary</h3>
        <p className="text-neutral leading-relaxed">{report.summary}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {report.indicators.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">Threat Indicators</h3>
            <ul className="space-y-2">
              {report.indicators.map((ind, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral">
                  <span className="text-danger">●</span> <strong>{ind.type}:</strong> {ind.description}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {report.recommendations.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-lg text-foreground">Recommendations</h3>
            <ul className="space-y-2">
              {report.recommendations.map((rec, i) => (
                <li key={i} className="flex gap-2 text-sm text-neutral">
                  <span className="text-primary">→</span> {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Card>
  );
};
