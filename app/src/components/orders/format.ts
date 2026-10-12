/**
 * Order dates render on the server and hydrate in the browser, so pin the
 * locale and time zone; otherwise server (UTC) and client output differ.
 */
const SHOP_LOCALE = "de-DE";
const SHOP_TIME_ZONE = "Europe/Berlin";

export function formatOrderDate(
  iso: string,
  options: Readonly<Intl.DateTimeFormatOptions> = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }
): string {
  return new Date(iso).toLocaleDateString(SHOP_LOCALE, {
    ...options,
    timeZone: SHOP_TIME_ZONE,
  });
}

export function formatOrderTime(iso: string): string {
  return new Date(iso).toLocaleTimeString(SHOP_LOCALE, {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: SHOP_TIME_ZONE,
  });
}

export function formatEuro(amount: number): string {
  return amount.toFixed(2).replace(".", ",");
}

export function formatKg(weightKg: number): string {
  return weightKg.toFixed(1).replace(".", ",");
}
