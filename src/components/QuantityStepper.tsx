import { faDigits } from "../lib/format";
import { MinusIcon, PlusIcon } from "./icons";

interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (next: number) => void;
}

export function QuantityStepper({ quantity, min = 1, max, onChange }: QuantityStepperProps) {
  const canDecrease = quantity > min;
  const canIncrease = max === undefined || quantity < max;

  return (
    <div className="inline-flex items-center gap-3 rounded-pill border border-line bg-surface px-1">
      <button
        type="button"
        aria-label="کاهش تعداد"
        disabled={!canDecrease}
        onClick={() => onChange(quantity - 1)}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-text-1 transition-colors hover:bg-hover disabled:text-text-3 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-6 text-center font-body">{faDigits(quantity)}</span>
      <button
        type="button"
        aria-label="افزایش تعداد"
        disabled={!canIncrease}
        onClick={() => onChange(quantity + 1)}
        className="flex h-11 w-11 items-center justify-center rounded-pill text-text-1 transition-colors hover:bg-hover disabled:text-text-3 disabled:opacity-50 disabled:hover:bg-transparent"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
    </div>
  );
}
