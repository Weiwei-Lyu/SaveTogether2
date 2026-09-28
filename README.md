# SaveTogether

A student savings planner with a private ledger and transparent group plans. Confirmed records are the only thing that counts as money saved.

## Local development

```bash
npm install
npm run dev
```

Required environment variables in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

After signup, open the confirmation link in email, then log in with the same password.

## Live app

https://savetogether2.vercel.app/
