# Firebase Billing Setup for Phone Authentication

## Why Billing is Required

Firebase phone authentication requires billing because:
- SMS messages cost money to send
- Even free tier usage requires a payment method on file
- Firebase needs to ensure they can charge for usage above free limits

## How to Enable Billing

### Step 1: Upgrade to Blaze Plan
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the ⚙️ (Settings) icon → **Usage and billing**
4. Click **Details & settings**
5. Click **Modify plan**
6. Select **Blaze (Pay as you go)**

### Step 2: Add Payment Method
1. Add your credit/debit card
2. Verify your payment method
3. Complete the billing setup

## Free Tier Limits (Blaze Plan)

Even with billing enabled, you get generous free limits:

### Phone Authentication
- **10,000 verifications/month FREE**
- After free tier: ~$0.006 per verification
- For personal projects, this is essentially free

### Other Services (that you're using)
- **Firestore**: 50,000 reads, 20,000 writes/day FREE
- **Authentication**: Unlimited users FREE
- **Hosting**: 10GB storage, 360MB/day transfer FREE

## Cost Estimate for Your Todo App

For a personal todo app with phone authentication:
- **Monthly cost: $0** (within free limits)
- Only charged if you exceed 10,000 phone logins per month

## Alternative: Disable Phone Auth (If You Don't Want Billing)

If you prefer not to enable billing, you can:
1. Remove phone authentication from the app
2. Use only email/password authentication
3. Consider other providers like Auth0 or Supabase for phone auth

## Next Steps

1. Enable billing in Firebase Console
2. Wait 5-10 minutes for changes to propagate
3. Try phone authentication again
4. Monitor usage in Firebase Console

The billing requirement is just a safety measure - for development and small-scale usage, you won't actually be charged anything.