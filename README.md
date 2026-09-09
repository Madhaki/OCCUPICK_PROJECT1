# OccuPick — Supabase Phase 1 + Seamless Auth

This build connects OccuPick to Supabase for authentication, profiles, and task posting.

## Supabase setup
1. Run `supabase_schema.sql` once in Supabase SQL Editor.
2. `config.js` contains the public/publishable Supabase key only.
3. For password reset, add your deployed site URL to Supabase Auth URL Configuration when you deploy. Local development can use the current page origin.

## Auth UX
- Animated login/signup modal
- Inline errors instead of disruptive alerts
- Loading states
- Show/hide password
- Password strength indicator
- Forgot password flow
- Email confirmation state
- Account/profile access after login
