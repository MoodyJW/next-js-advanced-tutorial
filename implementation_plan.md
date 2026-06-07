# Next.js Meta-Learning Tutorial App - Implementation Plan

This plan outlines a phased approach to building a Next.js tutorial web app. The application itself will serve as the curriculum, teaching Next.js App Router concepts incrementally as you build it. 

As requested, each phase is designed to be small enough to review in one sitting. I will stop after each phase for your review. All previously "optional" features (Testing, Code Playground, User Progress, Comments) have been baked into the core plan to avoid later refactoring.

## Plan Approved

We are currently executing the **Prerequisites & Setup** phase.

---

## 1. Prerequisites & Setup

Before writing business logic, we must establish the foundation with strict tooling and testing.

- **Node Version:** `>= 24.0.0` (Latest stable/LTS recommended).
- **App Generation Command:**
  ```bash
  npx create-next-app@latest next-js-advanced-tutorial \
    --ts --tailwind --eslint --app --src-dir false \
    --import-alias "@/*" --use-npm
  ```
- **Testing Setup:** Install and configure **Vitest** and **React Testing Library** for fast, reliable unit testing. 
- **Supabase Setup:** 
  - Your Project ID is: `yxqhnmdlpzzmpqvbmonc`. 
  - Your `NEXT_PUBLIC_SUPABASE_URL` is: `https://yxqhnmdlpzzmpqvbmonc.supabase.co`.
  - Your publishable key will be used as the public API key (`NEXT_PUBLIC_SUPABASE_ANON_KEY`): `sb_publishable_1h3F8iNlypH9lYVkYkWjhA_oB_-M-Mb`.
- **TypeScript Settings:** Ensure `tsconfig.json` has `"strict": true`, `"noImplicitAny": true`, and `"strictNullChecks": true`.
- **Environment Variables:** Create a `.env.example` template and `.env.local` for local development containing the Supabase keys.

---

## 2. Content Model (Supabase Schema)

We will use multiple tables to support lessons, user progress tracking, and comments. We will generate TypeScript types from this schema.

**Table: `lessons`**
- `id` (uuid, primary key)
- `slug` (text, unique)
- `title` (text)
- `content_markdown` (text)
- `phase_number` (int) - For sequential ordering

**Table: `user_progress`**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `lesson_id` (uuid, foreign key to lessons)
- `completed_at` (timestamp)

**Table: `comments`**
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to auth.users)
- `lesson_id` (uuid, foreign key to lessons)
- `content` (text)
- `created_at` (timestamp)

---

## 3. Phased Milestones

### Phase 1: Static Lesson Pages & Unit Testing
- **Objective:** Learn Next.js file-based routing, Server Components (default behavior), and unit testing setup.
- **Feature:** A static home page listing upcoming lessons, and a basic testing suite.
- **Files to create/modify:**
  - `app/layout.tsx` & `app/page.tsx`: Core application shell.
  - `components/LessonCard.tsx`: Reusable React component.
  - `components/LessonCard.test.tsx`: Unit test for the component.
- **Key Code Patterns:** File-based routing, exporting default page components.
- **TS Patterns:** Defining props interfaces (e.g., `interface LessonCardProps`).
- **Pause & Explore:** Run the Vitest test suite and watch it pass. Change a prop and watch it fail.
- **Comprehension Check:** Why is `app/page.tsx` mapped to `/`?

### Phase 2: Dynamic Routing & Server Components
- **Objective:** Understand dynamic segments (`[slug]`), Server Components for data fetching, and handling Not Found states.
- **Feature:** Dynamic lesson detail pages fetching mock data (local array initially).
- **Files to create/modify:**
  - `app/lessons/[slug]/page.tsx` & `app/lessons/[slug]/page.test.tsx`
  - `app/lessons/[slug]/not-found.tsx`
- **Key Code Patterns:** Awaiting Next.js `params` in page components, using `notFound()`.
- **TS Patterns:** Defining the `PageProps` shape using `Promise<{ slug: string }>` for dynamic App Router params.
- **Pause & Explore:** Pass a non-existent slug in the URL and observe the `not-found.tsx` rendering automatically.
- **Comprehension Check:** How do we extract the `slug` param from the URL?

### Phase 3: Client Components & Interactive Code Playground
- **Objective:** Differentiate Server vs. Client Components, use `"use client"`, and integrate third-party React libraries.
- **Feature:** An interactive code playground (using Sandpack) embedded in lessons, plus a client-side table of contents.
- **Files to create/modify:**
  - `components/CodePlayground.tsx` & `components/CodePlayground.test.tsx`
  - `components/Toc.tsx` & `components/Toc.test.tsx`
- **Key Code Patterns:** `"use client"` directive, `useState`, passing serializable props to Client Components.
- **TS Patterns:** Typing third-party library configurations (e.g., Sandpack options).
- **Pause & Explore:** Try editing the code inside the Sandpack playground in the browser to see real-time updates.
- **Comprehension Check:** Can a Server Component be rendered inside a Client Component?

### Phase 4: Supabase Integration & Server-Side Queries
- **Objective:** Connect to Postgres DB, query data securely on the server.
- **Feature:** Fetching the lessons list directly from Supabase instead of mock data.
- **Files to create/modify:**
  - `lib/supabase/server.ts` & `lib/supabase/server.test.ts`
  - `types/supabase.ts` (generated from schema)
  - Update `app/page.tsx` & `app/lessons/[slug]/page.tsx` to use Supabase.
- **Key Code Patterns:** Instantiating Supabase server client, awaiting DB queries inside the component body.
- **TS Patterns:** Generic Supabase client typing `SupabaseClient<Database>`.
- **Pause & Explore:** Console log the Supabase response in a Server Component and check where it prints.
- **Comprehension Check:** Why is it safe to use direct DB queries in Server Components without exposing credentials to the browser?

### Phase 5: Caching & Revalidation
- **Objective:** Master Next.js caching layers (Data cache, Full Route cache) and ISR (Incremental Static Regeneration).
- **Feature:** Statically generating lesson pages at build time with on-demand revalidation.
- **Files to create/modify:**
  - `app/lessons/[slug]/page.tsx`: Add `generateStaticParams` and cache tags.
  - `app/api/revalidate/route.ts` & `app/api/revalidate/route.test.ts`
- **Key Code Patterns:** Caching fetches, `revalidateTag()`, `generateStaticParams`.
- **TS Patterns:** Typing Route Handler requests (`NextRequest`).
- **Pause & Explore:** Update a lesson manually in Supabase UI and refresh the page. Notice it doesn't change until you trigger the revalidation endpoint.
- **Comprehension Check:** What is the difference between `revalidatePath` and `revalidateTag`?

### Phase 6: Loading States, Suspense, & Streaming
- **Objective:** Improve UX with streaming and granular loading boundaries.
- **Feature:** Adding skeleton loaders while database data is fetching.
- **Files to create/modify:**
  - `app/loading.tsx` & `app/lessons/[slug]/loading.tsx`
  - `components/RelatedLessons.tsx` (Wrapped in Suspense)
- **Key Code Patterns:** `<Suspense fallback={...}>`, `loading.tsx` file convention.
- **TS Patterns:** Typing generic React nodes (`React.ReactNode`).
- **Pause & Explore:** Simulate a slow DB query and watch how Next.js streams the UI.
- **Comprehension Check:** How does `loading.tsx` map to `<Suspense>` under the hood?

### Phase 7: Server Actions, Mutations & Progress Tracking
- **Objective:** Handle form submissions and mutations securely on the server.
- **Feature:** A "Mark as Complete" button that saves user progress to the `user_progress` Supabase table.
- **Files to create/modify:**
  - `app/actions/progress.ts` & `app/actions/progress.test.ts`
  - `components/MarkCompleteButton.tsx`
- **Key Code Patterns:** `"use server"`, invoking server actions from client components (`action={markComplete}`), `useFormStatus`.
- **TS Patterns:** Typing action return payloads with discriminated unions (e.g., `{ success: true } | { error: string }`).
- **Pause & Explore:** Disable JavaScript in the browser and see if the native form action still works.
- **Comprehension Check:** What is the difference between a Server Action and an API Route?

### Phase 8: Middleware, Authentication & Comments Section
- **Objective:** Run code before a request completes using Next.js 16 Proxy, manage auth sessions using `@supabase/ssr`, and build a secure interactive comments section.
- **Feature:** User login/signup forms, route protection via `proxy.ts`, session refreshes, and a real-time lesson comment section for authenticated users.
- **Files to create/modify:**
  - [NEW] [proxy.ts](file:///home/jay/Repos/next-js-advanced-tutorial/proxy.ts) & [proxy.test.ts](file:///home/jay/Repos/next-js-advanced-tutorial/proxy.test.ts): Custom routing session check.
  - [NEW] [app/login/page.tsx](file:///home/jay/Repos/next-js-advanced-tutorial/app/login/page.tsx): Authentication page for login and signup.
  - [NEW] [app/actions/auth.ts](file:///home/jay/Repos/next-js-advanced-tutorial/app/actions/auth.ts) & [app/actions/auth.test.ts](file:///home/jay/Repos/next-js-advanced-tutorial/app/actions/auth.test.ts): Auth server actions.
  - [NEW] [app/actions/comments.ts](file:///home/jay/Repos/next-js-advanced-tutorial/app/actions/comments.ts) & [app/actions/comments.test.ts](file:///home/jay/Repos/next-js-advanced-tutorial/app/actions/comments.test.ts): Comment insertion and retrieval actions.
  - [NEW] [components/CommentSection.tsx](file:///home/jay/Repos/next-js-advanced-tutorial/components/CommentSection.tsx) & [components/CommentSection.test.tsx](file:///home/jay/Repos/next-js-advanced-tutorial/components/CommentSection.test.tsx): Comments discussion UI.
  - [MODIFY] [app/lessons/[slug]/page.tsx](file:///home/jay/Repos/next-js-advanced-tutorial/app/lessons/[slug]/page.tsx): Connect comments section at bottom of dynamic lessons.
- **Key Code Patterns:** Next.js 16 `proxy` export signature, cookie management in server actions, dynamic forms with transitions, optimistic or immediate UI updates.
- **TS Patterns:** Typing `NextRequest`, session credentials, custom comment shapes, and server action responses.
- **Pause & Explore:** Attempt to view `/lessons/routing-and-layouts` while logged out and observe the seamless redirect to `/login?next=/lessons/routing-and-layouts`. Log in and verify redirect back to the lesson.
- **Comprehension Check:** Why is Next.js 16 `proxy` executing in the Node.js runtime superior to Edge runtime for complex modular imports?

### Phase 9: Image, Font, and Metadata Optimization
- **Objective:** Utilize Next.js built-in optimizations for performance and SEO.
- **Feature:** Adding dynamic SEO metadata to lesson pages, custom fonts, and optimized images for lesson banners.
- **Files to create/modify:**
  - `app/layout.tsx`: Add `next/font`.
  - `app/lessons/[slug]/page.tsx`: Export `generateMetadata`.
  - `components/LessonImage.tsx`: Use `next/image`.
- **Key Code Patterns:** `export async function generateMetadata()`, `<Image />`, `Inter({ subsets: ['latin'] })`.
- **TS Patterns:** `Metadata` and `ResolvingMetadata` types from `next`.
- **Pause & Explore:** Inspect the DOM and look at the `srcset` and `sizes` generated by `next/image`.
- **Comprehension Check:** Why is `next/image` better than a standard `<img>` tag?

### Phase 10: Error Handling
- **Objective:** Implement graceful error recovery.
- **Feature:** Handling deliberate runtime errors (e.g., simulating Supabase downtime).
- **Files to create/modify:**
  - `app/error.tsx` & `app/error.test.tsx`
  - `app/lessons/[slug]/error.tsx`
- **Key Code Patterns:** Client component error boundaries, `reset()` function to attempt recovery.
- **TS Patterns:** Typing the `error` prop as `Error & { digest?: string }`.
- **Pause & Explore:** Throw a manual error in a Server Component and see how the nearest error boundary catches it.
- **Comprehension Check:** Why must `error.tsx` be a Client Component?

---

## 4. Documentation Standards (Applied to all phases)

- **Top-of-file comments:** Every file starts with a block comment explaining its purpose and the Next.js concept it demonstrates.
- **TSDoc Comments:** Every exported function, component, type, and hook gets `/** ... */` detailing `@param`, `@returns`, and `@example`.
- **Inline Comments:** `//` comments on any non-obvious line, especially around App Router specific behavior.
- **Strict TypeScript:** Explicit, named types. No `any`. Prefer `interface` or `type` over inline shapes.
- **Unit Tests:** Every component, utility, and Server Action will have a corresponding `*.test.tsx` or `*.test.ts` file ensuring its behavior is covered.
- **Phase Summaries:** Each phase ends with a short `NOTES.md` or a comprehensive block comment summarizing the learnings in plain language.

---

## 5. Anti-patterns to Avoid

- **`"use client"` overuse:** Only use it when interactivity (hooks, event listeners) or browser APIs are needed. It is an opt-in to the client boundary, not a default.
- **Fetching data in Client Components:** Prefer Server Components for initial data fetching. Avoid `useEffect` data fetching unless absolutely necessary.
- **Bypassing TypeScript:** Strict TS will be enforced. Avoid type assertions (`as Type`) where possible.
- **Leaking Secrets:** Always prefix public environment variables with `NEXT_PUBLIC_`.
- **Stale Data:** Forgetting to call `revalidatePath` or `revalidateTag` after a Server Action mutates data.
