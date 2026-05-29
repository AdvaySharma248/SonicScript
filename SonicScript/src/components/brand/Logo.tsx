import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function Logo({
  className,
  withText = true,
}: {
  className?: string;
  withText?: boolean;
}) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5", className)}>
      <div className="relative size-8 rounded-lg bg-accent-green flex items-center justify-center">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-white"
        >
          <path
            d="M8 1.5C8 1.5 8 5 8 8M8 8C8 11 8 14.5 8 14.5M8 8C5 8 1.5 8 1.5 8M8 8C11 8 14.5 8 14.5 8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 4L12 12M12 4L4 12"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
        </svg>
      </div>
      {withText && (
        <span className="text-lg font-semibold tracking-tight text-foreground">
          SonicScript
        </span>
      )}
    </Link>
  );
}
