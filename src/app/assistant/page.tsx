"use client";
import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/AppShell';
import { Card, Button, Input, AlertDialog } from '@/components/ui';
import { Send, Bot, User, Trash2, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  'phishing': '### Phishing\n\nPhishing is a cyber attack where attackers disguise themselves as a trusted entity to trick victims into revealing sensitive information.\n\n* **Common Vectors**: Email, SMS (Smishing), Voice (Vishing).\n* **Prevention**: Always verify the sender domain and never click unverified links.',
  'malware': '### Malware\n\nMalware (malicious software) is any software intentionally designed to cause damage to a computer, server, client, or computer network.\n\n**Types of Malware:**\n1. Ransomware\n2. Trojans\n3. Spyware\n4. Worms',
  'qr': '### Malicious QR Codes (Quishing)\n\nMalicious QR codes can direct you to phishing sites or download malware. \n\n> Always verify the domain before proceeding.',
  'default': 'I am your rule-based Security Assistant. I can help answer basic questions about **phishing**, **malware**, **QR codes**, and general security best practices.\n\nHow can I help you today?'
};

const SUGGESTIONS = [
  "What is phishing?",
  "Explain malware",
  "Are QR codes safe?",
  "How to check an email?"
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', text: KNOWLEDGE_BASE.default }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
    const lowerInput = text.toLowerCase();
    let responseText = KNOWLEDGE_BASE.default;
    
    if (lowerInput.includes('phishing')) responseText = KNOWLEDGE_BASE.phishing;
    else if (lowerInput.includes('malware')) responseText = KNOWLEDGE_BASE.malware;
    else if (lowerInput.includes('qr') || lowerInput.includes('quishing')) responseText = KNOWLEDGE_BASE.qr;
    else if (lowerInput.includes('hello') || lowerInput.includes('hi')) responseText = "Hello! I am ready to assist you with security queries.";

    setTimeout(() => {
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'assistant', text: responseText }]);
      setIsTyping(false);
    }, 1000);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const clearChat = () => {
    setMessages([{ id: Date.now().toString(), role: 'assistant', text: KNOWLEDGE_BASE.default }]);
  };

  return (
    <AppShell>
      <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold">AI Security Assistant</h1>
            <p className="text-zinc-400">Ask questions about security best practices.</p>
          </div>
          <Button variant="secondary" onClick={() => setShowClearConfirm(true)}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear Chat
          </Button>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={m.id} 
                  className={`flex gap-4 group ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-md ${m.role === 'user' ? 'bg-blue-600' : 'bg-emerald-600'}`}>
                    {m.role === 'user' ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                  </div>
                  <div className={`relative px-5 py-4 rounded-2xl max-w-[85%] shadow-sm ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-zinc-800 text-zinc-100 rounded-tl-sm'}`}>
                    {m.role === 'assistant' && (
                      <button 
                        onClick={() => copyToClipboard(m.text, m.id)}
                        className="absolute top-2 right-2 p-1.5 bg-zinc-900/50 hover:bg-zinc-700 rounded-md text-zinc-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                      >
                        {copiedId === m.id ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                      </button>
                    )}
                    <div className={`prose prose-invert max-w-none ${m.role === 'user' ? 'text-white prose-p:text-white' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>
                        {m.text}
                      </ReactMarkdown>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full flex items-center justify-center shadow-md bg-emerald-600">
                    <Bot className="h-5 w-5 text-white" />
                  </div>
                  <div className="px-5 py-4 rounded-2xl max-w-[85%] bg-zinc-800 rounded-tl-sm flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={endRef} />
          </div>

          <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
            {messages.length === 1 && (
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                {SUGGESTIONS.map(s => (
                  <button 
                    key={s} 
                    onClick={() => handleSend(s)}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 transition-colors border border-zinc-700"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <form onSubmit={(e) => { e.preventDefault(); handleSend(input); }} className="flex gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about phishing, malware, etc..."
                className="flex-1"
              />
              <Button type="submit" disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>

        <AlertDialog 
          isOpen={showClearConfirm} 
          onClose={() => setShowClearConfirm(false)}
          onConfirm={clearChat}
          title="Clear Chat History"
          description="Are you sure you want to clear all messages? This action cannot be undone."
          confirmText="Clear Chat"
          isDestructive={true}
        />
      </div>
    </AppShell>
  );
}
