import React from 'react';
import { motion } from 'framer-motion';

interface MarqueeProps {
  text: string;
  direction?: 'left' | 'right';
  className?: string;
}

export const Marquee: React.FC<MarqueeProps> = ({ text, direction = 'left', className = '' }) => {
  return (
    <div className={`overflow-hidden whitespace-nowrap flex ${className}`}>
      <motion.div
        className="flex"
        animate={{
          x: direction === 'left' ? ['0%', '-50%'] : ['-50%', '0%'],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: 20,
        }}
      >
        <span className="text-[10vw] md:text-[15vw] font-bold text-slate-300/50 leading-none tracking-tighter uppercase px-4">
          {text} &nbsp; {text} &nbsp;
        </span>
        <span className="text-[10vw] md:text-[15vw] font-bold text-slate-300/50 leading-none tracking-tighter uppercase px-4">
          {text} &nbsp; {text} &nbsp;
        </span>
      </motion.div>
    </div>
  );
};