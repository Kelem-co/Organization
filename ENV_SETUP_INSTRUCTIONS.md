# Environment Setup Instructions

## ⚠️ CRITICAL: Environment variables in Next.js are embedded at BUILD TIME

This means you **MUST restart the development server** after changing `.env.local`.

## Step-by-Step Setup

### 1. Stop the Development Server

Press `Ctrl+C` in the terminal where `npm run dev` is running.

### 2. Verify `.env.local` File

Make sure `.env.local` exists in the project root with these values:

```env
# Backend API
NEXT_PUBLIC_API_BASE_URL=https://emphasis-kills-sheep-close.trycloudflare.com
NEXT_PUBLIC_API_TIMEOUT=30000

# Google Services
NEXT_PUBLIC_GOOGLE_MAPS_PLATFORM_KEY=
GEMINI_API_KEY=

# Feature Flags
NEXT_PUBLIC_FF_REAL_AUTH=true
NEXT_PUBLIC_FF_REAL_SCHOOLS=true
NEXT_PUBLIC_FF_REAL_BRANCHES=false
NEXT_PUBLIC_FF_REAL_ANALYTICS=false
NEXT_PUBLIC_FF_REAL_BILLING=false
NEXT_PUBLIC_FF_REAL_SETTINGS=false
NEXT_PUBLIC_FF_REAL_ONBOARDING=true
```

### 3. Restart the Development Server

```bash
npm run dev
```

### 4. Verify Configuration

Open http://localhost:3000/debug-env in your browser to verify:
- API Base URL shows the correct backend URL
- Feature flags show the correct enabled/disabled state

### 5. Check Browser Console

Open the browser console (F12) and look for these logs:
```
📋 App Configuration: { apiBaseUrl: "https://...", ... }
🚩 Feature Flags: { useRealAuth: true, ... }
```

## Common Issues

### Issue: Environment variables show as "undefined"

**Solution:** You forgot to restart the dev server. Stop it (Ctrl+C) and run `npm run dev` again.

### Issue: Still using mock data

**Solution:** 
1. Check `/debug-env` page to verify feature flags
2. Make sure the flag names match exactly (case-sensitive)
3. Values must be exactly `true` (not `True` or `TRUE`)
4. Restart the dev server

### Issue: API calls fail with CORS or 404

**Solution:**
1. Verify the backend URL is correct in `.env.local`
2. Make sure the backend server is running
3. Check the browser console for the actual URL being called
4. Restart the dev server after changing the URL

## How Next.js Environment Variables Work

- Variables prefixed with `NEXT_PUBLIC_` are embedded into the JavaScript bundle
- They are replaced at **build time**, not runtime
- Changing `.env.local` requires a restart to rebuild
- They are visible in the browser (don't put secrets here)
- Server-only variables (without `NEXT_PUBLIC_`) are never sent to the browser

## Testing the Setup

1. Visit http://localhost:3000/debug-env
2. Verify API Base URL matches your backend
3. Verify feature flags match your `.env.local`
4. Try logging in - it should call the real backend
5. Check the Network tab in browser DevTools to see actual API calls

## Need Help?

If environment variables still aren't working:
1. Delete `.next` folder: `rm -rf .next`
2. Restart dev server: `npm run dev`
3. Check `/debug-env` page again
4. Look for errors in terminal and browser console
