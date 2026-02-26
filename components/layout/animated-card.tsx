'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

// Re-exported wrapper around Card with a small hover lift.
type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function AnimatedCard({ children, ...props }: DivProps) {
  return (
    <motion.div whileHover={{ y: -3 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}>
      <Card {...props}>{children}</Card>
    </motion.div>
  );
}
