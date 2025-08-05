# Firebase Phone Authentication Setup

**This app uses ONLY phone number authentication - no email/password option.**

## Required Configuration

**⚠️ IMPORTANT: Phone Authentication requires billing to be enabled on your Firebase project, even for free tier usage.**

To enable phone authentication in your Firebase project, you need to:

### 0. Enable Billing (REQUIRED)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`todo-c389c`)
3. Go to **Settings** (⚙️) → **Usage and billing** → **Details & settings**
4. Click **Modify plan** and upgrade to **Blaze (Pay as you go)**
5. Add a payment method (credit card)

**Free Tier Limits:**
- First 10,000 phone authentications per month are **FREE**
- After that: ~$0.006 per verification
- For development/testing, this should cost nothing

### 1. Enable Phone Authentication in Firebase Console

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`todo-c389c`)
3. Go to **Authentication** → **Sign-in method**
4. Click on **Phone** and enable it
5. **CRITICAL:** Add your domain to the authorized domains list:
   - `localhost` (for development)
   - `127.0.0.1` (for development)
   - Your production domain (when deployed)

### 1.1. Fix Domain Authorization (REQUIRED)

**⚠️ This is the most common cause of auth/invalid-app-credential**

1. In Firebase Console → **Authentication** → **Settings** → **Authorized domains**
2. Make sure these domains are listed:
   - `localhost`
   - `127.0.0.1` 
   - `todo-c389c.firebaseapp.com`
3. Click **Add domain** if any are missing
4. **Wait 5-10 minutes** for changes to propagate

### 2. Add reCAPTCHA Test Keys (Optional for Development)

For testing purposes, you can add test phone numbers:

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Scroll down to **Phone numbers for testing**
3. Add test phone numbers and verification codes:
   - Phone: `+1 555-555-5555`
   - Code: `123456`

### 3. Production Setup

For production, you'll need to:

1. **Configure reCAPTCHA**: The app uses invisible reCAPTCHA for bot protection
2. **Add your domain**: Make sure your production domain is in the authorized domains list
3. **SMS Provider**: Firebase uses its default SMS provider, but you can configure custom providers if needed

### 4. Environment Variables

No additional environment variables are needed for phone authentication. The configuration is handled through the Firebase SDK.

### 2. Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the default rules with:

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

3. Click **Publish** to save the rules

## Testing the Implementation

1. Start the development server: `yarn dev`
2. Go to `http://localhost:3000`
3. Enter a phone number (use test numbers if configured)
4. Enter the verification code received via SMS
5. You should be automatically signed in
6. Try creating a task to test Firestore permissions

## Phone Number Format

The app supports US phone numbers and automatically formats them as:
- Input: `(555) 123-4567`
- Stored: `+15551234567`

Make sure to test with valid US phone numbers or configure international numbers in Firebase if needed.