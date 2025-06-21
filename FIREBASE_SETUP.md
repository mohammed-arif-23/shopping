# Firebase Authentication Setup Guide

## Fix for "auth/configuration-not-found" Error

This error occurs when Firebase Authentication doesn't recognize your domain. Follow these steps to fix it:

### Step 1: Firebase Console Setup

1. **Go to Firebase Console**
   - Open [https://console.firebase.google.com/](https://console.firebase.google.com/)
   - Select your project: `store-7b1b8`

2. **Configure Authentication**
   - In the left sidebar, click **"Authentication"**
   - Click on the **"Settings"** tab
   - Scroll down to **"Authorized domains"** section

3. **Add Authorized Domains**
   - Click **"Add domain"**
   - Add these domains:
     ```
     localhost
     127.0.0.1
     ```
   - Click **"Add"** for each domain

### Step 2: Enable Google Sign-in

1. **Go to Sign-in Methods**
   - In Authentication, click **"Sign-in method"** tab
   - Find **"Google"** in the list
   - Click on it to configure

2. **Enable Google Provider**
   - Toggle the **"Enable"** switch to ON
   - Set a **"Project support email"** (your email)
   - Click **"Save"**

### Step 3: Configure Firestore Database

1. **Go to Firestore Database**
   - In the left sidebar, click **"Firestore Database"**
   - If not created, click **"Create database"**
   - Choose **"Start in test mode"** for development
   - Select a location (choose the closest to you)

2. **Set Firestore Security Rules**
   - In Firestore Database, click **"Rules"** tab
   - Replace the rules with:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can read/write their own user document
       match /users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Users can read/write their own cart
       match /carts/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Users can read/write their own orders
       match /orders/{orderId} {
         allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
         allow create: if request.auth != null && request.auth.uid == request.resource.data.userId;
       }
     }
   }
   ```
   - Click **"Publish"**

### Step 4: Verify Configuration

1. **Check Project Settings**
   - Go to **Project Settings** (gear icon)
   - Scroll down to **"Your apps"** section
   - Make sure your web app is listed
   - Verify the configuration matches your `.env.local` file

### Step 5: Test Authentication

1. **Restart Development Server**
   ```bash
   npm run dev
   ```

2. **Clear Browser Cache**
   - Clear browser cache and cookies
   - Try in an incognito/private window

3. **Test Login**
   - Go to your app
   - Try the Google login
   - Check browser console for any errors

### Common Issues and Solutions

#### Issue: "auth/configuration-not-found"
**Solution:** Add `localhost` to authorized domains in Firebase Console

#### Issue: "Failed to get document because the client is offline"
**Solution:** 
- Make sure Firestore Database is created and enabled
- Check Firestore security rules
- Verify network connectivity
- The app will fallback to localStorage if Firestore is unavailable

#### Issue: "auth/cancelled-popup-request"
**Solution:** This is normal when user closes the popup. No action needed.

#### Issue: "auth/popup-closed-by-user"
**Solution:** User closed the popup. This is expected behavior.

#### Issue: Environment variables not loading
**Solution:** 
- Restart the development server
- Check that `.env.local` file exists in project root
- Verify no spaces around `=` in environment variables

### Environment Variables Check

Your `.env.local` file should contain:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBoudCIwdSR4mMZxC6Oob3IRbf720Gw9uU
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=store-7b1b8.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=store-7b1b8
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=store-7b1b8.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=611617459228
NEXT_PUBLIC_FIREBASE_APP_ID=1:611617459228:web:836debfa4e5d41d45e23d9
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-NS4SFVYTL4
```

### Debug Information

Check the browser console for these messages:
- "Firebase initialized successfully"
- "Using environment variables: true"
- "Current domain: localhost"
- "Auth domain: store-7b1b8.firebaseapp.com"

If you see "Missing" for any environment variables, restart your development server.

### Offline Support

The app now includes offline support:
- Cart data is saved to localStorage when Firestore is unavailable
- Authentication still works even if Firestore is offline
- The app gracefully handles network connectivity issues

### Database Collections

The app uses the following Firestore collections:
- **users**: User profile information
- **carts**: User shopping cart data
- **orders**: User order history and details 