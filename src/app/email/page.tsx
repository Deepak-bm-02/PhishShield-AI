"use client";
import { ScannerFramework } from '@/features/scanner/ScannerFramework';
import { analyzeEmail } from '@/lib/api/analyze';
import { Textarea } from '@/components/ui';

export default function EmailScannerPage() {
  return (
    <ScannerFramework
      title="Email Scanner"
      description="Analyze raw EML files or paste email content to detect phishing indicators."
      analyzeAction={analyzeEmail}
      validateInput={(val) => !val || val.trim().length < 10 ? 'Email content must be at least 10 characters long.' : null}
      inputComponent={({ value, onChange, error }) => (
        <div className="space-y-2">
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Paste email headers and body here..."
            className={`min-h-[120px] ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    />
  );
}
