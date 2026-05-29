import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Home,
  Mic,
  Upload,
  Clock,
  Settings,
} from "lucide-react";

const ITEMS = [
  { label: "Home", to: "/app", icon: Home },
  { label: "Record audio", to: "/app/record", icon: Mic },
  { label: "Upload audio", to: "/app/upload", icon: Upload },
  { label: "History", to: "/app/history", icon: Clock },
  { label: "Settings", to: "/app/settings", icon: Settings },
] as const;

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Jump to anywhere…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          {ITEMS.map((item) => (
            <CommandItem
              key={item.to}
              onSelect={() => {
                setOpen(false);
                navigate({ to: item.to });
              }}
            >
              <item.icon className="mr-2 h-4 w-4 text-accent-green" />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
