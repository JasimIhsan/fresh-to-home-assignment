import { CheckoutForm } from "./(components)/CheckoutForm";

/**
 * The cart lives in the browser, so checkout is a client form. Access is
 * gated by the proxy and the `placeOrder` action re-checks the session.
 */
export default function CheckoutPage() {
  return <CheckoutForm />;
}
