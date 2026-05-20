# Environment Variables - FIXED ✅

## What Was Wrong

The application was using **hardcoded values** instead of reading from environment variables. This is bad because:
- Can't easily change backend URL
- Different environments (dev/staging/prod) need different configs
- Secrets could be committed to git
- Not following Next.js best practices

## What Was Fixed

### 1. API Configuration (`src/lib/api/config.ts`)
✅ Now reads from `process.env.NEXT_PUBLIC_API_BASE_URL`
✅ Provides sensible defaults
✅ Logs configuration in development mode

### 2. Feature Flags (`src/config/featureFlags.ts`)
✅ Now reads from `process.env.NEXT_PUBLIC_FF_*` variables
✅ Properly parses boolean values
✅ Logs flags in development mode

### 3. Environment Files
✅ `.env.local` - Contains your actual configuration
✅ `.env.example` - Template for other developers
✅ Both files updated with correct backend URL

### 4. Branches API Integration
✅ Created proper TypeScript types (`src/lib/types/branches.ts`)
✅ Updated branches API service (`src/lib/services/branchesApi.ts`)
✅ Follows backend API structure from FRONTEND_API_INTEGRATION.md
✅ Uses `/api/branches/` endpoint with proper request/response format

## Current Configuration

Your `.env.local` file now has:

```env
NEXT_PUBLIC_API_BASE_URL=https://emphasis-kills-sheep-close.trycloudflare.com
NEXT_PUBLIC_API_TIMEOUT=30000

NEXT_PUBLIC_FF_REAL_AUTH=true
NEXT_PUBLIC_FF_REAL_SCHOOLS=true
NEXT_PUBLIC_FF_REAL_BRANCHES=false
NEXT_PUBLIC_FF_REAL_ONBOARDING=true
```

## ⚠️ CRITICAL: You MUST Restart the Dev Server

Next.js embeds environment variables at **BUILD TIME**, not runtime.

### How to Restart:

1. **Stop the server:** Press `Ctrl+C` in the terminal
2. **Start again:** Run `npm run dev`
3. **Verify:** Visit http://localhost:3000/debug-env

## How to Verify It's Working

### Method 1: Debug Page
Visit http://localhost:3000/debug-env

You should see:
- API Base URL: `https://emphasis-kills-sheep-close.trycloudflare.com`
- Feature flags showing correct enabled/disabled state

### Method 2: Browser Console
Open DevTools (F12) and look for:
```
📋 App Configuration: { apiBaseUrl: "https://emphasis-kills-sheep-close.trycloudflare.com", ... }
🚩 Feature Flags: { useRealAuth: true, useRealSchools: true, ... }
```

### Method 3: Network Tab
1. Open DevTools → Network tab
2. Try to login or fetch schools
3. Check the request URL - it should start with your backend URL

## Branches API Integration

The branches API is now properly integrated following the backend structure:

### Create Branch
```typescript
import { branchesApi } from '@/lib/services/branchesApi';

const newBranch = await branchesApi.create({
  organization: organizationId,
  school: schoolId,
  name: "Main Campus",
  address: "123 School Street",
  city: "Addis Ababa",
  region: "Addis Ababa",
  contact_phone: "+251911234567",
  contact_email: "main@school.edu.et",
  status: "ACTIVE"
});
```

### List Branches
```typescript
const response = await branchesApi.list();
// response.results contains array of branches
// response.count contains total count
```

### Get Single Branch
```typescript
const branch = await branchesApi.get(branchId);
```

### Update Branch
```typescript
const updated = await branchesApi.update(branchId, {
  name: "Updated Name",
  status: "INACTIVE"
});
```

### Delete Branch
```typescript
await branchesApi.delete(branchId);
```

## Common Issues & Solutions

### Issue: "Still using mock data"
**Solution:** 
1. Check `/debug-env` - are feature flags correct?
2. Did you restart the dev server?
3. Clear browser cache and reload

### Issue: "API calls return 404"
**Solution:**
1. Verify backend URL in `/debug-env`
2. Make sure backend server is running
3. Check if the endpoint exists in the backend

### Issue: "Environment variables undefined"
**Solution:**
1. Make sure `.env.local` exists in project root (not in `src/`)
2. Variable names must start with `NEXT_PUBLIC_`
3. **Restart the dev server** (this is the most common issue!)

### Issue: "CORS errors"
**Solution:**
1. Backend must allow your frontend origin
2. Check backend CORS configuration
3. Verify the backend URL is correct

## Best Practices Going Forward

### ✅ DO:
- Always use environment variables for configuration
- Import from `@/lib/api/config` or `@/config/featureFlags`
- Restart dev server after changing `.env.local`
- Keep `.env.local` in `.gitignore`
- Update `.env.example` when adding new variables

### ❌ DON'T:
- Hardcode URLs or API keys in source code
- Commit `.env.local` to git
- Forget to restart after env changes
- Use environment variables without `NEXT_PUBLIC_` prefix for client-side code

## Files Modified

1. `src/lib/api/config.ts` - API configuration
2. `src/config/featureFlags.ts` - Feature flags
3. `.env.local` - Your environment variables
4. `.env.example` - Template for other developers
5. `src/lib/types/branches.ts` - Branch types (NEW)
6. `src/lib/services/branchesApi.ts` - Branches API service (UPDATED)
7. `app/debug-env/page.tsx` - Debug page (NEW)
8. `ENV_SETUP_INSTRUCTIONS.md` - Setup guide (NEW)
9. `README.md` - Updated documentation

## Next Steps

1. **Restart your dev server** (if you haven't already)
2. Visit http://localhost:3000/debug-env to verify
3. Try logging in - it should use the real backend
4. Try creating a school - it should call the real API
5. Check browser console for configuration logs

## Need Help?

If you're still having issues:
1. Delete `.next` folder: `rm -rf .next`
2. Restart: `npm run dev`
3. Check `/debug-env` page
4. Look for errors in terminal and browser console
5. Verify backend is running and accessible

---

**Remember:** Environment variables in Next.js are embedded at BUILD TIME. Always restart the dev server after changing `.env.local`!
