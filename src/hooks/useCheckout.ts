import { useMutation } from "@tanstack/react-query";
import { createPayment, type CheckoutPayload } from "../lib/storeApi";

/** Submits guest checkout details to the BFF, which returns a Zarinpal
 *  redirect URL. The caller is responsible for redirecting (window.location). */
export function useCheckout() {
  return useMutation({
    mutationFn: (payload: CheckoutPayload) => createPayment(payload),
  });
}
