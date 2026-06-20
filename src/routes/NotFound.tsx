import { Link } from "react-router-dom";
import { GiltDivider } from "../components/Divider";

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-24 text-center">
      <p className="font-display text-7xl text-text-1">۴۰۴</p>
      <GiltDivider />
      <p className="text-text-2">این صفحه پیدا نشد.</p>
      <Link
        to="/"
        className="mt-2 rounded-pill bg-brand-solid px-7 py-3 font-medium text-brand-on transition-colors hover:bg-shade"
      >
        بازگشت به خانه
      </Link>
    </div>
  );
}
