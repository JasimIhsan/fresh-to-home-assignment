/** Serializable result returned by every Server Action. */
export type ActionResult<T> =
  | { readonly success: true; readonly data: T }
  | { readonly success: false; readonly error: string };

export function ok<T>(data: T): ActionResult<T> {
  return { success: true, data };
}

export function fail<T = never>(error: string): ActionResult<T> {
  return { success: false, error };
}
