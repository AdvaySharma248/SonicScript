import { cn } from "@/lib/utils";

type Props = {
  bars?: number;
  active?: boolean;
  className?: string;
  levels?: number[];
};

export function Waveform({
  bars = 32,
  active = true,
  className,
  levels,
}: Props) {
  const items = Array.from({ length: bars });
  return (
    <div
      className={cn("flex items-end justify-center gap-[3px] h-32", className)}
    >
      {items.map((_, i) => {
        /* Alternate warm colors */
        const colorIdx = i % 3;
        const color =
          colorIdx === 0
            ? "bg-accent-green"
            : colorIdx === 1
              ? "bg-accent-green/60"
              : "bg-accent-orange/50";

        if (levels) {
          const h = Math.max(8, Math.min(100, levels[i] * 100));
          return (
            <div
              key={i}
              className={cn(
                "w-1 rounded-full transition-all duration-100",
                color,
              )}
              style={{ height: `${h}%`, opacity: active ? 1 : 0.25 }}
            />
          );
        }

        const delay = (i * 80) % 1200;
        return (
          <div
            key={i}
            className={cn(
              "w-1 rounded-full",
              color,
              active && "animate-[wave-bar_1.4s_ease-in-out_infinite]",
            )}
            style={{
              animationDelay: `${delay}ms`,
              height: active ? undefined : "16%",
              opacity: active ? undefined : 0.25,
            }}
          />
        );
      })}
    </div>
  );
}
