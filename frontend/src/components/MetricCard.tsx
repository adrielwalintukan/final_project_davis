import React, { useState, useEffect, useRef } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  subtitle?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, subtitle }) => {
  const [displayValue, setDisplayValue] = useState<string | number>(value);
  const prevValueRef = useRef<number>(0);
  const requestRef = useRef<number>(null);

  const parseNumber = (val: string | number): number => {
    if (typeof val === 'number') return val;
    return parseFloat(val.replace(/[^0-9.-]+/g, "")) || 0;
  };

  const formatValue = (num: number, original: string | number): string => {
    const isPercent = typeof original === 'string' && original.includes('%');
    const isCurrency = typeof original === 'string' && original.includes('$');
    if (isCurrency) return `$${Math.floor(num).toLocaleString()}`;
    if (isPercent) return `${num.toFixed(2)}%`;
    return Math.floor(num).toLocaleString();
  };

  useEffect(() => {
    const targetValue = parseNumber(value);
    const startValue = prevValueRef.current;
    const duration = 250; // Perpendek durasi menjadi 250ms agar sangat responsif
    let startTimestamp: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Linear transition untuk kecepatan maksimal
      const currentValue = startValue + (targetValue - startValue) * progress;
      setDisplayValue(formatValue(currentValue, value));

      if (progress < 1) {
        requestRef.current = requestAnimationFrame(animate);
      } else {
        prevValueRef.current = targetValue;
      }
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [value]);

  return (
    <div className="bg-[#1a1a2e] border border-purple-900/20 rounded-xl p-4.5 hover:border-violet-500/40 transition-all animate-fade-up">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#55556a] mb-1">{label}</p>
        <h3 className="font-['Space_Grotesk'] text-2xl font-bold text-white mb-0.5">{displayValue}</h3>
        {subtitle && <p className="text-[10px] text-[#9090b0] font-medium opacity-80">{subtitle}</p>}
      </div>
    </div>
  );
};

export default MetricCard;
