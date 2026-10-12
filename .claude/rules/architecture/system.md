# Next.js Architecture & Coding Standards

## 1. Directory Structure & Component Boundaries

- **Root UI Primitives (`src/components/ui/`):**
   - Place base, reusable design tokens here (`Button.tsx`, `Input.tsx`, `Label.tsx`, `Card.tsx`).
   - Primitives must be strictly typed, accessible, and extend standard HTML interfaces using `ComponentPropsWithoutRef` or `ComponentPropsWithRef`.
   - For polymorphic elements, forward refs cleanly with `forwardRef`.
- **Global Composite Components (`src/components/`):**
   - Place shared, cross-page composites here (e.g., `MetricWidget.tsx`, `Navbar.tsx`).
- **Feature/Page-Specific Components (`src/app/<route>/(components)/`):**
   - Co-locate components scoped to a single route inside `(components)` route groups (e.g., `src/app/about/(components)/`).
   - Keep route groups non-routable; do not create orphan routes.
- **Pages & Layouts:**
   - `page.tsx` and `layout.tsx` files are React Server Components (RSC) by default. Use them to read params, invoke the Data Access Layer (DAL), and orchestrate subcomponents.
- **Leaf-Node Client Rule:**
   - Push `'use client'` as far down the component tree as possible (leaf nodes).
   - Never mark an entire page or large container as a Client Component just to attach event listeners or local state. Pass Server Components or static JSX down as `children` or props to interactive client wrappers.

## 2. Data Access & Network Rules

- **Data Access Layer (DAL):**
   - Place all direct database, ORM queries, and cached retrieval logic in `src/lib/dal/<feature>.dal.ts`.
   - Every DAL file MUST begin with `import 'server-only';`.
   - Server Components (RSC) must call DAL functions directly—never make internal HTTP `fetch()` calls to local Route Handlers.
- **Client Components (`'use client'`):**
   - NEVER import server secrets, DB clients, or `@/lib/dal/*` inside Client Components.
   - For mutations, invoke Server Actions (`src/app/actions/*`).
   - Route Handlers (`app/api/**/route.ts`) are reserved strictly for external webhooks, public mobile clients, and cron jobs.
- **Server Action Standards:**
   - Start every action file with `'use server';`.
   - Validate all inputs at the boundary using Zod.
   - Return a standardized serializable response shape instead of throwing uncaught errors to the client:
      ```typescript
      type ActionResult<T> = { readonly success: true; readonly data: T } | { readonly success: false; readonly error: string };
      ```
   - Always pair database mutations with explicit cache busting via `revalidatePath(...)` or `revalidateTag(...)`.
   - Never return sensitive database fields (hashed passwords, internal tokens, soft-delete flags) to the caller.

## 3. Strict Type Safety (Zero `any`)

- The `any` type is strictly forbidden across the entire codebase.
- Use `unknown` with runtime type narrowing or Zod schemas for untrusted input.
- Wrap external parameters and dataset arrays with `readonly` modifiers to enforce immutability (`readonly T[]`, `Readonly<Record<...>>`).
- **Async Route Parameters (Next.js 15+):**
   - In `page.tsx`, `layout.tsx`, and Route Handlers, treat `params` and `searchParams` as asynchronous Promises:
      ```typescript
      interface PageProps {
         readonly params: Promise<{ readonly slug: string }>;
         readonly searchParams: Promise<{ readonly q?: string | string[] }>;
      }
      ```
   - Always `await` `params` and `searchParams`. Never access them synchronously.
   - Explicitly guard against HTTP Parameter Pollution (`string[]` vs. `string`) when reading search parameters.

## 4. Performance & Algorithmic Standards (DSA)

- Avoid naive nested iterations ($O(N \cdot M)$) for search, filtering, and joining datasets in client or server memory.
- Use appropriate data structures:
   - Hash maps (`Map<string, T>`) for $O(1)$ lookups.
   - Sets (`Set<string>`) for set intersections and membership checks.
   - Inverted indexes or prefix tries when performing multi-token in-memory text search.
- **Serverless DSA Memory Safety:**
   - Bound in-memory caches and lookup maps with a strict maximum size (LRU eviction) to prevent memory leaks in serverless or containerized environments.
   - Do not reconstruct heavy global state structures on every incoming request; memoize them module-wide or delegate to an external store (Redis / Database) if data grows dynamically.
- Use `React.useTransition` or native URL state updates for non-blocking client-side filtering and search.

## 5. Security & Edge Case Handling

- **Input Sanitization & DoS Guards:**
   - Enforce character length limits (`maxLength` on client inputs, `.slice(0, N)` / Zod constraints in actions and DAL).
   - Protect search inputs against ReDoS (avoid complex unconstrained regex; use token splitting and Unicode word boundaries `\p{L}\p{N}`).
- **Defensive Rendering & State:**
   - Always render dedicated zero-state/empty-state UI when collections are empty (`length === 0`).
   - Provide fallback skeletons wrapped in `<Suspense>` around async client search and filtering controls.
   - For search inputs and filter controls synced with URL search params, use `defaultValue` instead of `value` unless managing an explicitly controlled input, avoiding cursor-jumping bugs.
   - Guard browser-only APIs (`window`, `localStorage`, `document`) inside `useEffect` or check `typeof window !== 'undefined'` to prevent hydration mismatches.
- **CSS / Class Injection:**
   - Never concatenate raw strings without sanitization. Use a dedicated `cn(...)` utility for conditional classes.

## 6. Next.js Performance Optimization (Next 16 / React 19)

- **Caching & Rendering Strategy:**
   - Prefer static or cached rendering by default. Only opt into dynamic rendering (`cookies()`, `headers()`, `searchParams`, `connection()`) in the smallest subtree that needs it, wrapped in `<Suspense>`.
   - Cache DAL reads with the `'use cache'` directive (requires `cacheComponents: true` in `next.config.ts`) and attach `cacheTag(...)` + `cacheLife(...)` profiles. Bust them from Server Actions with `revalidateTag(...)` / `updateTag(...)`.
   - Never cache per-user or auth-scoped data in a shared cache; key it by user or keep it dynamic.
   - Wrap repeated per-request DAL reads in `React.cache()` to dedupe calls across layouts, pages, and `generateMetadata`.
   - Use `generateStaticParams` for high-traffic dynamic routes (e.g., product detail pages) so they pre-render at build time.
- **Data Fetching:**
   - Eliminate request waterfalls: start independent queries in parallel with `Promise.all` (or kick off promises before the first `await`).
   - Stream slow sections behind `<Suspense>` boundaries with skeleton fallbacks instead of blocking the whole page; add `loading.tsx` for route-level fallbacks.
   - Select only the columns you render (`.select('id, name, price')`); never `select('*')` for list views. Paginate or `.limit()` every collection query.
   - Pass promises from RSC to client components and unwrap with `use()` when the client needs streamed data.
- **Client Bundle Size:**
   - Keep `'use client'` boundaries minimal (see §1); every import inside a client file ships to the browser.
   - Lazy-load heavy, below-the-fold, or interaction-gated client components (modals, charts, editors, maps) with `next/dynamic`; use `{ ssr: false }` only for browser-only widgets.
   - Import icons and utilities by named export from tree-shakeable packages; list barrel-heavy libraries in `experimental.optimizePackageImports`.
   - Do not pass large serialized objects across the RSC → client boundary; pass only the fields the client component uses.
   - Do not hand-write `useMemo` / `useCallback` / `React.memo` by default. Add them only for a measured hot path or when the React Compiler is not enabled.
- **Images, Fonts & Assets:**
   - Always use `next/image` with explicit `width`/`height` (or `fill` + `sizes`) to prevent layout shift. Set `priority` (or `fetchPriority="high"`) only on the LCP image, such as the hero or first product image.
   - Configure remote image hosts (e.g., the Supabase Storage domain) via `images.remotePatterns`; never use raw `<img>` for content imagery.
   - Load fonts with `next/font` (self-hosted, `display: 'swap'`, subset). Never use `<link>` tags to Google Fonts.
   - Load third-party scripts with `next/script` using `strategy="lazyOnload"` or `"afterInteractive"`; never block rendering.
- **Navigation & Interactivity:**
   - Use `next/link` for internal navigation so routes prefetch. Disable prefetch (`prefetch={false}`) on long lists of rarely visited links.
   - Use `useOptimistic` for instant feedback on cart and quantity mutations, reconciling with the Server Action result.
   - Debounce search inputs (~300ms) before pushing to the URL, and wrap URL updates in `startTransition`.
- **Measurement:**
   - Track Core Web Vitals (LCP, INP, CLS) with `useReportWebVitals` or Vercel Speed Insights. Treat regressions as bugs.
   - Run `next build` and review route sizes and static/dynamic markers before merging route-level changes. Use `@next/bundle-analyzer` when the client JS for a route grows.
