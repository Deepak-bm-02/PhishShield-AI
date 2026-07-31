import * as React from 'react';
import { cn } from '../../lib/utils';

export const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={cn("bg-card border border-border rounded-xl p-6 shadow-sm", className)}>
    {children}
  </div>
);

export const Button = ({ className, onClick, children, disabled, variant = 'primary' }: { className?: string, onClick?: () => void, children: React.ReactNode, disabled?: boolean, variant?: 'primary'|'secondary'|'danger' }) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-blue-600',
    secondary: 'bg-neutral text-white hover:bg-zinc-600',
    danger: 'bg-danger text-white hover:bg-red-600'
  };
  return (
    <button disabled={disabled} onClick={onClick} className={cn("px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50", variants[variant], className)}>
      {children}
    </button>
  );
};

export const Badge = ({ children, variant = 'neutral' }: { children: React.ReactNode, variant?: 'success'|'warning'|'danger'|'neutral' }) => {
  const variants = {
    success: 'bg-success/10 text-success border-success/20',
    warning: 'bg-warning/10 text-warning border-warning/20',
    danger: 'bg-danger/10 text-danger border-danger/20',
    neutral: 'bg-neutral/10 text-foreground border-neutral/20'
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-semibold border", variants[variant])}>
      {children}
    </span>
  );
};
