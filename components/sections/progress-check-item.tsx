'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useProgress } from '@/components/providers/progress-provider';

export function ProgressCheckItem({ id, label, className }: { id: string; label: string; className?: string }) {
  const { isChecked, toggleChecked } = useProgress();
  const checked = isChecked(id);

  return (
    <label className={cn('flex items-start gap-3 rounded-lg border border-transparent px-2 py-1.5 transition-colors hover:bg-muted/50', className)}>
      <Checkbox checked={checked} onCheckedChange={(next) => toggleChecked(id, next)} aria-label={label} />
      <span className={cn('text-sm leading-6', checked && 'text-muted-foreground line-through')}>{label}</span>
    </label>
  );
}
