import Link from 'next/link';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center px-4">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold text-foreground mb-6">
          PhishShield <span className="text-primary">AI</span>
        </h1>
        <p className="text-xl text-neutral mb-10">
          AI-Powered Security Operations Center for Everyday Users. Scan emails, URLs, screenshots, and QR codes instantly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/scanner">
            <Button className="text-lg px-8 py-4">Launch Scanner</Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="secondary" className="text-lg px-8 py-4">View Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
