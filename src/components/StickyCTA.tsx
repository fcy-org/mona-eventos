import { ArrowRight } from "lucide-react";

export function StickyCTA({ onClick }: { onClick: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 py-3 backdrop-blur-md md:hidden">
      <button
        onClick={onClick}
        className="group flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-4 text-sm font-medium text-primary-foreground shadow-gold transition-all active:scale-[0.98]"
      >
        Agendar minha visita guiada
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
