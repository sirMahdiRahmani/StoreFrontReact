import { Diamond } from "./icons";

/**
 * Signature gilt rule with a centered diamond — the recurring heirloom motif
 * that separates sections across the storefront.
 */
export function GiltDivider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px w-10 bg-gradient-to-l from-gilt/50 to-transparent sm:w-16" />
      <Diamond />
      <span className="h-px w-10 bg-gradient-to-r from-gilt/50 to-transparent sm:w-16" />
    </div>
  );
}
