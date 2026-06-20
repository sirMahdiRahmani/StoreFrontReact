const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/** Convert Latin digits in a string/number to Persian digits. */
export const faDigits = (s: string | number): string =>
  String(s).replace(/\d/g, (d) => PERSIAN_DIGITS[+d]);

/** Format a Toman amount with Persian digits + Persian thousands separator. */
export const toman = (n: number): string =>
  `${faDigits(n.toLocaleString("en-US").replace(/,/g, "٬"))} تومان`;

/** Format a 0-5 rating for aria-label, e.g. "۴ از ۵ امتیاز". */
export const ratingAriaLabel = (rating: number, max = 5): string =>
  `${faDigits(rating)} از ${faDigits(max)} امتیاز`;
