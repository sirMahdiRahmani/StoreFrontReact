import { Link } from "react-router-dom";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  ctaLabel?: string;
  ctaTo?: string;
}

export function EmptyState({ icon, title, ctaLabel, ctaTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      {icon}
      <p className="text-text-2">{title}</p>
      {ctaLabel && ctaTo && (
        <Link
          to={ctaTo}
          className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
