"use client";
import { ScannerFramework } from '@/features/scanner/ScannerFramework';
import { analyzeUrl } from '@/lib/api/analyze';
import { Input } from '@/components/ui';
import { Link } from 'lucide-react';

export default function UrlScannerPage() {
  const isValidUrl = (urlString: string) => {
    try { 
      return Boolean(new URL(urlString)); 
    }
    catch{ 
      return false; 
    }
  }

  return (
    <ScannerFramework
      title="URL Scanner"
      description="Scan suspicious links for malicious intent before clicking."
      scanType="url"
      analyzeAction={analyzeUrl}
      validateInput={(val) => !val || !isValidUrl(val) ? 'Please enter a valid HTTP/HTTPS URL.' : null}
      inputComponent={({ value, onChange, error }) => (
        <div className="space-y-2">
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://example.com/login"
            icon={<Link className="h-4 w-4" />}
            className={error ? 'border-red-500 focus:ring-red-500' : ''}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    />
  );
}
