import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApplyCoupon, useCart, useRemoveCartItem, useUpdateCartItem } from "../hooks/useCart";
import { QuantityStepper } from "../components/QuantityStepper";
import { EmptyState } from "../components/EmptyState";
import { toman } from "../lib/format";

export function Cart() {
  const { data: cart, isLoading, isError, refetch } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const applyCoupon = useApplyCoupon();
  const [couponCode, setCouponCode] = useState("");
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="px-4 py-12 text-center text-text-2">در حال بارگذاری سبد خرید…</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-3 px-4 py-12 text-center text-text-2">
        <p>بارگذاری سبد خرید ممکن نشد. دوباره تلاش کنید.</p>
        <button
          type="button"
          onClick={() => refetch()}
          className="rounded-pill border border-line px-4 py-2 text-sm text-text-1"
        >
          تلاش دوباره
        </button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <EmptyState
        title="سبد خرید شما خالی است"
        ctaLabel="بازگشت به فروشگاه"
        ctaTo="/shop"
      />
    );
  }

  return (
    <div className="px-4 py-6">
      <h1 className="font-display text-2xl text-text-1">سبد خرید</h1>

      <div className="mt-4 grid gap-6 lg:grid-cols-2">
        <div className="order-2 flex flex-col gap-4 lg:order-1 lg:col-start-2">
          {cart.items.map((item) => (
            <div key={item.key} className="flex items-center gap-3 rounded-card border border-line-card p-3">
              {item.image && (
                <img src={item.image} alt={item.name} className="h-16 w-16 rounded-chip bg-photo-bg object-cover" />
              )}
              <div className="flex-1">
                <p className="font-display text-text-1">{item.name}</p>
                <QuantityStepper
                  quantity={item.quantity}
                  onChange={(q) => updateItem.mutate({ key: item.key, quantity: q })}
                />
              </div>
              <p className="font-body font-bold text-text-1">{toman(Number(item.totals.line_total))}</p>
              <button
                type="button"
                aria-label="حذف"
                onClick={() => removeItem.mutate(item.key)}
                className="text-text-3"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        <div className="order-1 flex flex-col gap-4 rounded-panel border border-line-card bg-surface-2 p-4 shadow-panel lg:order-2 lg:col-start-1 lg:row-start-1 lg:h-fit">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (couponCode) applyCoupon.mutate(couponCode);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="کد تخفیف"
              className="flex-1 rounded-chip border border-line bg-surface px-3 py-2"
            />
            <button
              type="submit"
              className="rounded-chip border border-line px-4 py-2 text-sm text-text-1"
            >
              اعمال
            </button>
          </form>

          <div className="flex items-center justify-between border-t border-line pt-3">
            <span className="text-text-2">مجموع</span>
            <span className="font-body text-lg font-bold text-text-1">
              {toman(Number(cart.totals.total_price))}
            </span>
          </div>

          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="rounded-pill bg-brand-solid px-6 py-3 font-medium text-brand-on"
          >
            ادامهٔ فرایند خرید
          </button>
        </div>
      </div>

      <Link to="/shop" className="mt-6 inline-block text-sm text-text-2 underline">
        بازگشت به فروشگاه
      </Link>
    </div>
  );
}
