export function About() {
  return (
    <div className="px-4 py-8">
      <h1 className="font-display text-2xl text-text-1">دربارهٔ ما</h1>
      <p className="mt-3 max-w-prose text-text-2">
        رگالیا با دقت و عشق به جزئیات، قطعاتی می‌سازد که داستان خودشان را روایت می‌کنند.
        هر طرح در کارگاه ما طراحی و به‌صورت دستی تکمیل می‌شود.
      </p>

      <h2 className="mt-8 font-display text-xl text-text-1">تماس با ما</h2>
      <ul className="mt-3 flex flex-col gap-2 text-text-2">
        <li>
          تلفن:{" "}
          <span dir="ltr" className="text-start">
            ۰۲۱-۱۲۳۴۵۶۷۸
          </span>
        </li>
        <li>اینستاگرام: @regalia.shop</li>
      </ul>
    </div>
  );
}
