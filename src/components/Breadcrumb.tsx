import { Link } from "react-router-dom";
import { ChevronIcon } from "./icons";

interface BreadcrumbItem {
  label: string;
  to?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="مسیر صفحه" className="flex items-center gap-2 text-sm text-text-3">
      {items.map((item, i) => (
        <span key={item.label} className="flex items-center gap-2">
          {item.to ? (
            <Link to={item.to} className="hover:text-text-1">
              {item.label}
            </Link>
          ) : (
            <span className="text-text-1">{item.label}</span>
          )}
          {i < items.length - 1 && <ChevronIcon className="h-4 w-4 text-text-3" />}
        </span>
      ))}
    </nav>
  );
}
