"use client";
import { ScannerFramework } from '@/features/scanner/ScannerFramework';
import { analyzeScreenshot } from '@/lib/api/analyze';
import { Upload } from '@/components/ui';

export default function ScreenshotScannerPage() {
  return (
    <ScannerFramework
      title="Screenshot Scanner"
      description="Upload a screenshot to extract text and analyze for threats via OCR."
      analyzeAction={analyzeScreenshot}
      isImage={true}
      validateInput={(val) => !val ? 'Please upload a screenshot image.' : null}
      inputComponent={({ onChange, error }) => (
        <div className="space-y-2">
          <Upload onFileSelect={onChange} accept="image/*" />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      )}
    />
  );
}
