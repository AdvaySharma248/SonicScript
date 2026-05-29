import { Menu } from "lucide-react";
import { Logo } from "@/components/brand/Logo";

export function AppHeader({
  onMenuToggle,
  title,
}: {
  onMenuToggle: () => void;
  title: string;
}) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-xl flex items-center px-5 sm:px-8 gap-4 border-b border-border/60">
      <button
        onClick={onMenuToggle}
        className="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition"
        aria-label="Menu"
      >
        <Menu className="size-5" />
      </button>

      <div className="hidden md:block">
        <Logo />
      </div>
      <div className="md:hidden">
        <Logo withText={false} />
      </div>

      <div className="flex-1" />

      <h1 className="text-sm font-medium text-muted-foreground hidden sm:block">
        {title}
      </h1>

      <div className="flex-1 hidden sm:block" />

      <div className="size-9 rounded-full bg-accent-green flex items-center justify-center text-xs font-semibold text-white">
        MS
      </div>
    </header>
  );
}
