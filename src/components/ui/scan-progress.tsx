"use client";
import React, { useEffect, useState } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";

const STAGES = [
  "Uploading Payload",
  "Validating Content",
  "Extracting Artifacts (OCR/Decryption)",
  "Gemini AI Analysis",
  "Risk Engine Evaluation",
  "Querying Threat Intelligence",
  "Formatting Response"
];

interface ScanProgressTimelineProps {
  onComplete: () => void;
}

export function ScanProgressTimeline({ onComplete }: ScanProgressTimelineProps) {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const totalStages = STAGES.length;
    let stage = 0;
    
    // Simulate real-time progress steps for UX
    const interval = setInterval(() => {
      stage += 1;
      if (stage >= totalStages) {
        clearInterval(interval);
        onComplete();
      } else {
        setCurrentStage(stage);
      }
    }, 600); // 600ms per stage

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="max-w-md mx-auto py-8">
      <div className="space-y-6">
        {STAGES.map((stageName, index) => {
          const isCompleted = index < currentStage;
          const isActive = index === currentStage;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const isPending = index > currentStage;

          return (
            <div key={stageName} className="flex items-center gap-4 relative">
              {/* Connecting line */}
              {index !== STAGES.length - 1 && (
                <div className={`absolute left-[11px] top-6 w-[2px] h-6 transition-colors duration-300 ${isCompleted ? 'bg-blue-500' : 'bg-zinc-800'}`} />
              )}
              
              <div className="relative z-10 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-6 w-6 text-blue-500" />
                ) : isActive ? (
                  <div className="h-6 w-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Loader2 className="h-4 w-4 text-blue-400 animate-spin" />
                  </div>
                ) : (
                  <Circle className="h-6 w-6 text-zinc-700" />
                )}
              </div>
              
              <div className={`flex-1 transition-colors duration-300 ${isCompleted ? 'text-zinc-300' : isActive ? 'text-white font-medium' : 'text-zinc-600'}`}>
                {stageName}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
