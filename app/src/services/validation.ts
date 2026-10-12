/**
 * Form validation rules. Each validator returns a map of field → i18n key
 * for the fields that are invalid; translate with `t()` at render time.
 */
export type FieldErrors<F extends string> = Partial<Record<F, string>>;

export const MIN_PASSWORD_LENGTH = 6;
export const MIN_NAME_LENGTH = 2;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]{5,15}$/;

export function hasErrors<F extends string>(errors: FieldErrors<F>): boolean {
  return Object.values(errors).some(Boolean);
}

function emailError(email: string): string | undefined {
  if (!email.trim()) return "validation.emailRequired";
  if (!EMAIL_PATTERN.test(email.trim())) return "validation.emailInvalid";
}

function passwordError(password: string): string | undefined {
  if (!password) return "validation.passwordRequired";
  if (password.length < MIN_PASSWORD_LENGTH) {
    return "validation.passwordMinLength";
  }
}

function nameError(name: string): string | undefined {
  if (!name.trim()) return "validation.nameRequired";
  if (name.trim().length < MIN_NAME_LENGTH) return "validation.nameMinLength";
}

function positiveNumberError(
  value: string,
  key: string,
  { allowZero }: { allowZero: boolean }
): string | undefined {
  const parsed = parseFloat(value);
  if (!value.trim() || isNaN(parsed) || parsed < 0) return key;
  if (!allowZero && parsed === 0) return key;
}

/** Drops valid (undefined) entries so `hasErrors` and lookups stay simple. */
function compact<F extends string>(
  errors: Record<F, string | undefined>
): FieldErrors<F> {
  return Object.fromEntries(
    Object.entries(errors).filter(([, v]) => v)
  ) as FieldErrors<F>;
}

export function validateLoginForm(values: { email: string; password: string }) {
  return compact({
    email: emailError(values.email),
    password: passwordError(values.password),
  });
}

export function validateSignupForm(values: {
  name: string;
  email: string;
  password: string;
  consent: boolean;
}) {
  return compact({
    name: nameError(values.name),
    email: emailError(values.email),
    password: passwordError(values.password),
    consent: values.consent ? undefined : "validation.consentRequired",
  });
}

export function validatePasswordResetRequest(values: { email: string }) {
  return compact({ email: emailError(values.email) });
}

export function validateNewPassword(values: {
  password: string;
  confirmPassword: string;
}) {
  return compact({
    password:
      passwordError(values.password) ??
      (values.password !== values.confirmPassword
        ? "resetPassword.mismatch"
        : undefined),
  });
}

export function validateCheckoutForm(values: {
  fullName: string;
  street: string;
  zip: string;
  city: string;
  phone: string;
}) {
  const phone = values.phone.trim();
  return compact({
    fullName: nameError(values.fullName),
    street: values.street.trim() ? undefined : "validation.streetRequired",
    zip: values.zip.trim().length >= 3 ? undefined : "validation.zipRequired",
    city: values.city.trim() ? undefined : "validation.cityRequired",
    phone: !phone
      ? "validation.phoneRequired"
      : PHONE_PATTERN.test(phone)
        ? undefined
        : "validation.phoneInvalid",
  });
}

export function validateProductForm(values: {
  name: string;
  pricePerKg: string;
  stockKg: string;
  origin: string;
}) {
  return compact({
    name: values.name.trim() ? undefined : "validation.productNameRequired",
    pricePerKg: positiveNumberError(
      values.pricePerKg,
      "validation.priceRequired",
      { allowZero: false }
    ),
    stockKg: positiveNumberError(values.stockKg, "validation.stockRequired", {
      allowZero: true,
    }),
    origin: values.origin.trim() ? undefined : "validation.originRequired",
  });
}
