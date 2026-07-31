"use client";
import { ScannerFramework } from '@/features/scanner/ScannerFramework';
import { analyzeQr } from '@/lib/api/analyze';
import { Upload } from '@/components/ui';

export default function QrScannerPage() {
  return (
    <ScannerFramework
      title="QR Code Scanner"
      description="Upload or drag & drop QR codes to decode and verify their safety."
      analyzeAction={analyzeQr}
      isImage={true}
      validateInput={(val) => !val ? 'Please upload an image file.' : null}
      inputComponent={({ onChange, error }) => (
        <div className="space-y-2">
          <Upload onFileSelect={onChange} accept="image/*" />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    />
  );
}
