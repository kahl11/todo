# Immediate Fix for auth/invalid-app-credential

## 🚨 URGENT: Follow These Steps Exactly

### Step 1: Firebase Console - Fix Authorized Domains
1. **Open**: https://console.firebase.google.com/
2. **Select**: `todo-c389c` project
3. **Go to**: Authentication → Settings → Authorized domains
4. **Check if these domains exist:**
   - `localhost`
   - `127.0.0.1`
   - `todo-c389c.firebaseapp.com`
5. **If missing, click "Add domain" and add them**
6. **IMPORTANT**: Wait 10 minutes after adding

### Step 2: Clear Everything and Restart
```bash
# In your terminal:
cd /Users/kevinahl/Documents/todo
rm -rf .next
yarn dev
```

### Step 3: Clear Browser Data
1. **Open Developer Tools** (F12)
2. **Go to Application tab** → Storage
3. **Clear all:** Cookies, Local Storage, Session Storage
4. **Hard refresh:** Ctrl+Shift+R (or Cmd+Shift+R on Mac)

### Step 4: Test in Incognito
1. **Open incognito/private window**
2. **Go to**: http://localhost:3000
3. **Try phone authentication**

## 🔍 Check Firebase Console Status

### Verify Project Settings:
1. **Project Settings** → General tab
2. **Confirm Web API Key**: AIzaSyCgzl79KsqqcCKp2Ez6-bBDpQqYeW8cw94
3. **Confirm Project ID**: todo-c389c

### Verify Authentication Status:
1. **Authentication** → Sign-in method
2. **Phone should be ENABLED**
3. **Check quota usage** (shouldn't be exceeded)

## 🚨 If Still Not Working:

### Try This Emergency Fix:
1. **Disable phone authentication** in Firebase Console
2. **Wait 2 minutes**
3. **Re-enable phone authentication**
4. **Wait 5 minutes**
5. **Try again**

### Or Create New Test Project:
1. **Create new Firebase project** with different name
2. **Update your firebase.ts** with new config
3. **Test if it works**
4. This will confirm if it's a project-specific issue

## ⏰ Expected Timeline:
- **Authorized domains**: 5-10 minutes to take effect
- **Authentication changes**: 2-5 minutes
- **Cache clearing**: Immediate

The error trace shows it's failing during reCAPTCHA verification, which is 99% a domain authorization issue.