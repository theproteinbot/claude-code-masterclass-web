'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type CheckboxProps = {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  className?: string;
  'aria-label'?: string;
};

export function Checkbox({ checked, onCheckedChange, className, ...props }: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        'flex h-5 w-5 items-center justify-center rounded border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        checked ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-card hover:bg-muted',
        className,
      )}
      {...props}
    >
      <Check className={cn('h-3.5 w-3.5', checked ? 'opacity-100' : 'opacity-0')} />
    </button>
  );
}
