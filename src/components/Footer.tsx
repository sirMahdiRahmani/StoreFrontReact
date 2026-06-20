import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-line bg-surface-2 px-4 py-8 text-center text-sm text-text-3">
      <p>رگالیا — ساخته‌شده با دقت و عشق به جزئیات.</p>
      <Link to="/about" className="mt-2 inline-block underline">
        دربارهٔ ما / تماس با ما
      </Link>
    </footer>
  );
}
