import { Link, useSearchParams } from "react-router-dom";
import { faDigits } from "../lib/format";

type ResultStatus = "success" | "failed" | "verifying";

export function PaymentResult() {
  const [params] = useSearchParams();
  const status = (params.get("status") as ResultStatus) ?? "verifying";
  const orderId = params.get("order");
  const refId = params.get("ref_id");

  if (status === "verifying") {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-line border-t-brand motion-reduce:animate-none" />
        <p className="text-text-2">در حال بررسی نتیجهٔ پرداخت…</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
        <span aria-hidden="true" className="text-5xl text-text-3">✕</span>
        <h1 className="font-display text-xl text-text-1">پرداخت ناموفق بود</h1>
        <p className="text-text-2">سبد خرید شما دست‌نخورده باقی مانده است.</p>
        <div className="flex gap-3">
          <Link to="/checkout" className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on">
            تلاش دوباره
          </Link>
          <Link to="/cart" className="rounded-pill border border-line px-6 py-3 font-medium text-text-1">
            بازگشت به سبد خرید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-4 py-16 text-center">
      <span aria-hidden="true" className="text-5xl text-brand">✓</span>
      <h1 className="font-display text-xl text-text-1">پرداخت با موفقیت انجام شد</h1>
      {orderId && <p className="text-text-2">شماره سفارش: {faDigits(orderId)}</p>}
      {refId && (
        <p dir="ltr" className="text-text-2">
          کد پیگیری: {refId}
        </p>
      )}
      <Link to="/shop" className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
