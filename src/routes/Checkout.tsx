import { useState, type FormEvent } from "react";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { toman } from "../lib/format";
import type { CheckoutPayload } from "../lib/storeApi";

const EMPTY_FORM: CheckoutPayload = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  postalCode: "",
  note: "",
};

export function Checkout() {
  const { data: cart } = useCart();
  const checkout = useCheckout();
  const [form, setForm] = useState<CheckoutPayload>(EMPTY_FORM);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    checkout.mutate(form, {
      onSuccess: ({ redirectUrl }) => {
        window.location.href = redirectUrl;
      },
    });
  };

  const update = (key: keyof CheckoutPayload) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl text-text-1">تسویه‌حساب</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <form onSubmit={handleSubmit} className="order-2 flex flex-col gap-3 lg:order-1 lg:col-start-2">
          <div className="grid grid-cols-2 gap-3">
            <Field label="نام" value={form.firstName} onChange={update("firstName")} required />
            <Field label="نام خانوادگی" value={form.lastName} onChange={update("lastName")} required />
          </div>
          <Field label="موبایل" value={form.phone} onChange={update("phone")} dir="ltr" required type="tel" />
          <Field label="ایمیل" value={form.email} onChange={update("email")} dir="ltr" type="email" />
          <Field label="آدرس" value={form.address} onChange={update("address")} required />
          <div className="grid grid-cols-2 gap-3">
            <Field label="شهر" value={form.city} onChange={update("city")} required />
            <Field label="کد پستی" value={form.postalCode} onChange={update("postalCode")} dir="ltr" />
          </div>
          <label className="flex flex-col gap-1 text-sm text-text-2">
            توضیحات سفارش (اختیاری)
            <textarea
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              className="rounded-chip border border-line bg-surface px-3 py-2"
              rows={3}
            />
          </label>

          {checkout.isError && (
            <p className="text-sm text-text-2">ایجاد پرداخت ناموفق بود. دوباره تلاش کنید.</p>
          )}
        </form>

        <div className="order-1 flex flex-col gap-4 rounded-panel border border-line-card bg-surface-2 p-4 shadow-panel lg:order-2 lg:col-start-1 lg:row-start-1 lg:h-fit">
          <h2 className="font-display text-lg text-text-1">خلاصهٔ سفارش</h2>
          {cart && (
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-text-2">مبلغ قابل پرداخت</span>
              <span className="font-body text-lg font-bold text-text-1">
                {toman(Number(cart.totals.total_price))}
              </span>
            </div>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={checkout.isPending}
            className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on disabled:opacity-50"
          >
            {checkout.isPending ? "در حال انتقال به درگاه…" : "انتقال به درگاه پرداخت"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  dir?: "ltr" | "rtl";
  required?: boolean;
  type?: string;
}

function Field({ label, value, onChange, dir, required, type = "text" }: FieldProps) {
  return (
    <label className="flex flex-col gap-1 text-sm text-text-2">
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        dir={dir}
        className="rounded-chip border border-line bg-surface px-3 py-2 text-start"
      />
    </label>
  );
}
