# DirectHome — Vercel deploy checklist

Use this when shipping to production or after rotating Supabase / Flutterwave credentials. **Never commit real keys** — only set them in Vercel (production) or a local `.env` (development).

Supabase project: **DirectHome** — `https://xdyrwlseqwggdqhutoop.supabase.co`

---

## 1. Environment variables (Vercel)

**Vercel → Project → Settings → Environment Variables**

Set for **Production** (and Preview if you test PRs with real payments):

| Variable | Scope | Purpose |
|----------|--------|---------|
| `VITE_SUPABASE_URL` | Client (build) | Browser Supabase client |
| `VITE_SUPABASE_ANON_KEY` | Client (build) | Browser Supabase client |
| `SUPABASE_URL` | Server | Payment API fallback URL |
| `SUPABASE_ANON_KEY` | Server | Optional server fallback |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Persist verified tool payments and construction projects |
| `VITE_FLUTTERWAVE_PUBLIC_KEY` | Client (build) | Checkout modal (live: `FLWPUBK-…`) |
| `FLUTTERWAVE_SECRET_KEY` | Server only | Verify transactions (live: `FLWSECK-…`) |
| `VITE_MAPBOX_TOKEN` | Client (build) | Maps (if used) |

Optional: AdSense vars (`VITE_ADSENSE_*`) — leave empty until approved.

### Naming rules

- **`VITE_` prefix** — exposed to the browser at build time. Only anon/public keys here.
- **No `VITE_` on secrets** — `FLUTTERWAVE_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY` must never be prefixed with `VITE_`.
- **Do not put `FLWSECK_*` in a `VITE_` variable.**

### Flutterwave live vs test

| Key shape | Mode |
|-----------|------|
| `FLWPUBK_TEST-…` / `FLWSECK_TEST-…` | Test checkout (banner “test mode”) |
| `FLWPUBK-…` / `FLWSECK-…` (no `_TEST-`) | Live checkout |

Public and secret keys must **both** be live (or both test). Mixing live public + test secret breaks verification.

---

## 2. Local development vs Vercel

| | Localhost (`npm run dev`) | Vercel production |
|--|---------------------------|-------------------|
| Config source | `.env` in project root | Vercel env vars |
| After changing env | Restart dev server | **Redeploy** (see below) |
| Flutterwave | Uses whatever is in local `.env` | Uses Vercel vars from last build |
| Payment APIs | Vite dev middleware (`/api/verify-flutterwave`) | Vercel serverless (`api/*.js`) |

Copy live values into local `.env` only if you need live checkout on localhost. Otherwise keep test keys locally.

Template: [`.env.example`](./.env.example)

---

## 3. Deploy

1. Confirm env vars are saved in Vercel for **Production**.
2. Trigger a new deployment:
   - **Push to `main`** (auto-deploy), or
   - Vercel → Deployments → **Redeploy** (use this after env-only changes with no new commit).
3. Wait for build to finish; env vars are baked in at **build time** for `VITE_*` variables.

```bash
npm run build    # optional local smoke test before push
```

---

## 4. Post-deploy smoke test (~5 min)

### Auth & data

- [ ] Home page loads
- [ ] Register / login works (Supabase)
- [ ] Seeker or owner dashboard loads without console Supabase errors

### Construction estimator (₦399 per project)

- [ ] Apply migration `20260820100000_construction_projects.sql` on Supabase (if not already applied)
- [ ] Complete wizard → project page opens at `/construction-estimator/projects/:id`
- [ ] Paywall appears (no totals before payment)
- [ ] Flutterwave opens in **live** mode (no test banner if live keys are set)
- [ ] After payment, full report unlocks for **that project only**
- [ ] New estimate → new project → separate ₦399 payment
- [ ] Signed-in user sees projects under Profile → **Build estimates**
- [ ] Guest: sign up with checkout email → projects appear in profile
- [ ] **Download PDF report** opens print / save dialog (or HTML fallback)

### Admin (if applicable)

- [ ] Admin → payments list shows the test transaction (name, email, reference)

---

## 5. Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| Flutterwave still “test mode” on **production** | Test public key in Vercel, or old deploy | Set live `VITE_FLUTTERWAVE_PUBLIC_KEY`, redeploy |
| Flutterwave test mode **only on localhost** | Local `.env` still has `_TEST_` keys | Update local `.env` or ignore (expected) |
| Payment succeeds but unlock fails | Secret key mismatch or missing `SUPABASE_SERVICE_ROLE_KEY` | Match live secret in Vercel; redeploy |
| Auth works locally, fails on Vercel | Missing or wrong `VITE_SUPABASE_*` on Production | Re-check vars; redeploy |
| Env changed but app unchanged | No redeploy after env edit | Redeploy from Vercel dashboard |

Dev hint: if `VITE_FLUTTERWAVE_PUBLIC_KEY` contains `_TEST-`, the browser console warns in development.

---

## 6. Do not commit

- `.env` (real credentials)
- `FLWSECK_*` or service role keys in any client-side file
- `src/assets/dh-pin-brass.png` (deprecated asset)

---

*Last updated: August 2026 — live Flutterwave and Supabase credentials configured on Vercel production.*
