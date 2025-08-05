# Fix Firestore Permission Denied Error

## 🚨 URGENT: Update Firestore Security Rules

The error `Missing or insufficient permissions` means your Firestore database security rules are blocking access.

## 🎯 Quick Fix - Update Firestore Rules

### Step 1: Open Firebase Console
1. **Go to**: https://console.firebase.google.com/
2. **Select**: `todo-c389c` project
3. **Navigate**: Firestore Database → Rules

### Step 2: Replace Current Rules
**Replace your current rules with this:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow authenticated users to read/write their own tasks
    match /tasks/{taskId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
    }
    
    // Allow authenticated users to read/write their own user data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Deny all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### Step 3: Test Rules (Optional)
**You can test these rules in the Firebase Console:**
1. **Click "Rules playground"**
2. **Set authentication**: `auth.uid = "test-user-id"`
3. **Test path**: `/tasks/test-task-id`
4. **Should show**: ✅ Allow

### Step 4: Publish Rules
1. **Click "Publish"**
2. **Rules take effect immediately**

## 🔒 What These Rules Do

- **Tasks**: Users can only access tasks where `userId` matches their authentication ID
- **Users**: Users can only access their own user documents
- **Everything else**: Denied by default (secure)

## 🚀 Alternative: Temporary Development Rules

**If you want to test quickly first, use these permissive rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

**⚠️ WARNING**: Only use these for development - they allow any authenticated user to access all data.

## ✅ After Updating Rules

1. **Refresh your app**: `http://localhost:3000`
2. **Sign in with phone number**
3. **Try creating a task**
4. **Should work without errors**

The permission error should be completely resolved!