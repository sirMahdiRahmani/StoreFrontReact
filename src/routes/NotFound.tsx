import { Link } from "react-router-dom";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-4 px-4 py-20 text-center">
      <p className="font-display text-6xl text-text-1">۴۰۴</p>
      <p className="text-text-2">این صفحه پیدا نشد.</p>
      <Link to="/" className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on">
        بازگشت به خانه
      </Link>
    </div>
  );
}
