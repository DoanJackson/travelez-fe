"use client";

import { useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
import { Star, Users, MapPin } from "lucide-react";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

interface StatItem {
  icon: React.ReactNode;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
}

function CountingNumber({
  target,
  decimals,
  suffix,
  inView,
}: {
  target: number;
  decimals: number;
  suffix: string;
  inView: boolean;
}) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(reduced ? target : 0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!inView || startedRef.current || reduced) return;
    startedRef.current = true;

    const duration = 1800; // ms
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(parseFloat((eased * target).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, target, decimals, reduced]);

  return (
    <span>
      {decimals > 0 ? value.toFixed(decimals) : value.toLocaleString()}
      {suffix}
    </span>
  );
}

const stats: StatItem[] = [
  {
    icon: <MapPin className="h-7 w-7 text-pink-500" />,
    target: 50000,
    decimals: 0,
    suffix: "+",
    label: "Itineraries created",
  },
  {
    icon: <Users className="h-7 w-7 text-pink-500" />,
    target: 120,
    decimals: 0,
    suffix: "K+",
    label: "Happy travellers",
  },
  {
    icon: <Star className="h-7 w-7 text-pink-500" />,
    target: 4.8,
    decimals: 1,
    suffix: "/5",
    label: "Average rating",
  },
];

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="bg-slate-50 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-10 text-center text-sm font-semibold uppercase tracking-widest text-slate-400">
          Trusted by travellers across Vietnam
        </p>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={cn(
                "flex flex-col items-center gap-3 rounded-2xl bg-white p-8 text-center shadow-sm",
                "transition-transform duration-300 hover:-translate-y-1",
              )}
            >
              {stat.icon}
              <p className="text-4xl font-bold text-slate-900">
                <CountingNumber
                  target={stat.target}
                  decimals={stat.decimals}
                  suffix={stat.suffix}
                  inView={inView}
                />
              </p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
