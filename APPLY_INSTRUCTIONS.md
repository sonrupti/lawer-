# How to apply these changes to your NyayaIntel repo

1. **Delete** `src/lib/supabase.ts` from your repo — it's an empty file that was
   shadowing your real `src/lib/supabase.js` and breaking the entire build.

2. **Replace** these files in your repo with the versions here:
   - `package.json` (added next, @supabase/ssr, @supabase/supabase-js, next-themes,
     @anthropic-ai/sdk as real dependencies; fixed scripts to run `next dev`
     instead of `vite`)
   - `src/components/Navbar.jsx` (added "Ask AI" nav link, desktop + mobile)

3. **Add** these new files:
   - `postcss.config.mjs` (required for Tailwind v4 to work under Next.js —
     the Vite app used a different plugin mechanism)
   - `src/app/api/chat/route.js`
   - `src/app/ask-ai/page.jsx`
   - `src/app/ask-ai/AskAiClient.jsx`

4. **Set your Anthropic API key.** Copy the `ANTHROPIC_API_KEY=` line from
   `.env.local.example` into your real `.env.local` and fill in a key from
   https://console.anthropic.com/settings/keys

5. Run:
   ```
   npm install
   npm run dev
   ```
   Then visit http://localhost:3000/ask-ai

## What this does NOT include yet
- No persistence — conversations aren't saved to Supabase. There's no
  `conversations` / `messages` table in your schema.sql yet, so nothing is
  stored between page loads. Happy to design that schema + wire it up next.
- No real lawyer matching yet — the "Find a Lawyer →" button just links to
  your existing `/lawyers` directory rather than doing topic-based matching.
- The old Vite/Figma export (`figma-make-app` folder, `vite.config.ts`) is
  untouched. It's no longer what `npm run dev` runs, but I didn't delete it
  in case you want to reference the Figma-generated UI.
