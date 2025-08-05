# Firebase Authentication Troubleshooting

## Error: auth/invalid-app-credential

This error typically occurs with phone authentication due to domain authorization or reCAPTCHA issues.

### Solution 1: Fix Authorized Domains (Most Common)

1. **Go to Firebase Console** → Your project → **Authentication**
2. **Click Settings tab** → **Authorized domains**
3. **Ensure these domains are listed:**
   - `localhost`
   - `127.0.0.1`
   - `todo-c389c.firebaseapp.com`
4. **Add missing domains** by clicking "Add domain"
5. **Wait 5-10 minutes** for changes to take effect

### Solution 2: Clear Browser Cache & Cookies

1. **Open Developer Tools** (F12)
2. **Right-click refresh button** → "Empty Cache and Hard Reload"
3. **Clear all cookies** for localhost
4. **Try authentication again**

### Solution 3: Test with Different Browser

1. **Open incognito/private window**
2. **Navigate to** `http://localhost:3000`
3. **Try phone authentication**
4. If it works, clear cache in original browser

### Solution 4: Verify Firebase Configuration

Check your `firebase.ts` file has correct values:

```typescript
const firebaseConfig = {
  apiKey: "AIzaSyCgzl79KsqqcCKp2Ez6-bBDpQqYeW8cw94",
  authDomain: "todo-c389c.firebaseapp.com",  // Must match your project
  projectId: "todo-c389c",                   // Must match your project
  storageBucket: "todo-c389c.firebasestorage.app",
  messagingSenderId: "736147378828",
  appId: "1:736147378828:web:5424e20198f034b8bb21a9"
};
```

### Solution 5: Restart Development Server

1. **Stop the dev server** (Ctrl+C)
2. **Clear Next.js cache:** `rm -rf .next`
3. **Restart:** `yarn dev`
4. **Try authentication again**

### Solution 6: Check Network/Firewall

1. **Disable VPN** if using one
2. **Check firewall settings** - ensure Firebase domains aren't blocked
3. **Try different network** (mobile hotspot)

### Solution 7: Firebase Console Settings

1. **Go to Project Settings** → **General**
2. **Verify Web API Key** matches your config
3. **Check if project is active** (not suspended)

## Testing Checklist

- [ ] Billing enabled (Blaze plan)
- [ ] Phone authentication enabled
- [ ] Authorized domains include localhost
- [ ] Browser cache cleared
- [ ] Dev server restarted
- [ ] Correct Firebase config values
- [ ] No VPN/firewall blocking Firebase

## Still Having Issues?

1. **Check Firebase Console errors** in the Usage tab
2. **Monitor browser console** for additional error details
3. **Try with a different phone number**
4. **Test in a completely different browser**

The `auth/invalid-app-credential` error is almost always solved by fixing authorized domains or clearing browser cache.