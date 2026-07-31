"use client";
import Link from 'next/link';
import { Button } from '@/components/ui';
import { motion } from 'framer-motion';
import { Shield, Search, Zap, ChevronRight, Globe, Smartphone, QrCode } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden selection:bg-blue-500/30">
      {/* Top Navbar */}
      <header className="fixed top-0 w-full z-50 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Shield className="h-6 w-6 text-blue-500" />
            <span>PhishShield AI</span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-zinc-50 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-zinc-50 transition-colors">How it Works</a>
            <a href="#stats" className="hover:text-zinc-50 transition-colors">Statistics</a>
          </nav>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
            </Link>
            <Link href="/dashboard">
              <Button>Launch App <ChevronRight className="ml-2 h-4 w-4" /></Button>
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-zinc-950 to-zinc-950 -z-10" />
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20 mb-8">
                <Zap className="h-4 w-4" /> Next-Gen AI Threat Detection
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                Security Operations <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                  for the Modern Web
                </span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
                PhishShield AI analyzes emails, URLs, screenshots, and QR codes instantly using advanced Gemini models to protect you from sophisticated phishing attacks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/dashboard">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                    Start Scanning Now
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg h-14 px-8">
                    View Features
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-900/50 border-y border-zinc-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Unified Threat Intelligence</h2>
              <p className="text-zinc-400 max-w-2xl mx-auto">One platform to scan and detect anomalies across all your attack vectors.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Email Analysis', desc: 'Deep inspection of headers, routing, and intent.', icon: Search },
                { title: 'URL Scanning', desc: 'Real-time detonation and domain reputation checks.', icon: Globe },
                { title: 'OCR Screenshots', desc: 'Extracts and analyzes text from suspicious images.', icon: Smartphone },
                { title: 'QR Code Decoding', desc: 'Validates hidden URLs inside malicious QR codes.', icon: QrCode }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl hover:border-zinc-700 transition-colors"
                >
                  <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Threats Blocked', value: '2.4M+' },
                { label: 'Response Time', value: '< 200ms' },
                { label: 'Accuracy', value: '99.9%' },
                { label: 'Active Users', value: '50k+' }
              ].map((stat, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{stat.value}</div>
                  <div className="text-sm font-medium text-zinc-400 uppercase tracking-wider">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How PhishShield Works</h2>
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
              <div className="flex-1 text-center p-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700 text-xl font-bold text-blue-400">1</div>
                <h3 className="text-xl font-bold mb-2">Input Data</h3>
                <p className="text-zinc-400 text-sm">Paste a URL, upload an EML file, or drop a screenshot.</p>
              </div>
              <div className="hidden md:block w-16 h-0.5 bg-zinc-800"></div>
              <div className="flex-1 text-center p-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700 text-xl font-bold text-blue-400">2</div>
                <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
                <p className="text-zinc-400 text-sm">Our Gemini-powered Risk Engine evaluates the content.</p>
              </div>
              <div className="hidden md:block w-16 h-0.5 bg-zinc-800"></div>
              <div className="flex-1 text-center p-6">
                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-700 text-xl font-bold text-blue-400">3</div>
                <h3 className="text-xl font-bold mb-2">Get Verdict</h3>
                <p className="text-zinc-400 text-sm">Receive a clear Safe, Suspicious, or High Risk verdict instantly.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-blue-600/10 blur-[100px] -z-10" />
          <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-16 text-center shadow-2xl">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to secure your workspace?</h2>
            <p className="text-zinc-400 mb-10 text-lg max-w-2xl mx-auto">
              Join thousands of users leveraging PhishShield AI to proactively stop credential harvesting and malware.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="h-14 px-10 text-lg">
                Enter Dashboard <ChevronRight className="ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 py-12 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Shield className="h-5 w-5 text-blue-500" />
            PhishShield AI
          </div>
          <p className="text-zinc-500 text-sm">© {new Date().getFullYear()} PhishShield AI. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-zinc-500 hover:text-zinc-300">Privacy</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300">Terms</a>
            <a href="#" className="text-zinc-500 hover:text-zinc-300">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
