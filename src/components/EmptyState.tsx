import { Link } from "react-router-dom";
import { Diamond } from "./icons";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export function EmptyState({ icon, title, ctaLabel, ctaTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      {icon ?? <Diamond className="h-3 w-3 opacity-50" />}
      <p className="font-display text-lg text-text-1">{title}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="mt-1 rounded-pill bg-brand-solid px-7 py-3 font-medium text-brand-on transition-colors hover:bg-shade"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
