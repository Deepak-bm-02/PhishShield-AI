"use client";
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Button } from './button';

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
}

export function AlertDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = true,
}: AlertDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md bg-card border border-border shadow-2xl rounded-xl overflow-hidden"
            >
              <div className="p-6">
                <div className="flex gap-4">
                  <div className={`mt-0.5 shrink-0 h-10 w-10 rounded-full flex items-center justify-center ${isDestructive ? 'bg-red-500/10' : 'bg-blue-500/10'}`}>
                    <AlertTriangle className={`h-5 w-5 ${isDestructive ? 'text-red-500' : 'text-blue-500'}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                    <p className="text-sm text-neutral mt-2">{description}</p>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-background/50 border-t border-border flex justify-end gap-3">
                <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
                <Button 
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }} 
                  className={isDestructive ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                >
                  {confirmText}
                </Button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
