"use client";

import { motion, useReducedMotion } from "motion/react";

export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.3,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();

  const classes = className ? `${className} reveal` : "reveal";

  if (reduce) return <div className={classes}>{children}</div>;

  return (
    <motion.div
      className={classes}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
