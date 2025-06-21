# 🛍️ ShopWeb E-commerce Application

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9.0+-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

A modern, full-featured e-commerce application built with **Next.js 14**, featuring **Firebase authentication**, real-time cart synchronization, and a beautiful responsive design.

## ✨ Features

### 🔐 Authentication & Security
- **Google OAuth Integration** - Secure login with Google accounts
- **Session Persistence** - Stay logged in across browser sessions
- **Protected Routes** - Automatic redirects for unauthenticated users
- **Profile Management** - User profile with editable information

### 🛒 Shopping Experience
- **Real-time Cart Sync** - Cart data synchronized across devices via Firebase
- **Offline Support** - Cart persists even when offline
- **Smart Checkout** - Streamlined checkout with authentication protection
- **Order Tracking** - Real-time order status and tracking system

### 🎨 User Interface
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Modern UI** - Clean, professional interface with custom color palette
- **Smooth Animations** - Beautiful hover effects and transitions
- **Loading States** - Professional loading indicators throughout

### 🔍 Product Management
- **Advanced Search** - Product search with filters and categories
- **Product Details** - Comprehensive product information pages
- **Category Navigation** - Easy browsing by product categories
- **Wishlist Support** - Save products for later

## 🛠️ Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14 | React framework with App Router |
| **React** | 18 | UI library with hooks |
| **Tailwind CSS** | 3.0+ | Utility-first CSS framework |
| **Firebase Auth** | 9.0+ | Google OAuth authentication |
| **Firestore** | 9.0+ | Real-time database |
| **Lucide React** | Latest | Beautiful icons |
| **Context API** | Built-in | State management |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ 
- **npm** or **yarn**
- **Firebase account**

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/shopweb-ecommerce.git
cd shopweb-ecommerce
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Firebase Setup

#### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Follow the setup wizard
4. Note your **Project ID**

#### Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **Google** provider
5. Add `localhost` to **Authorized domains**

#### Step 3: Enable Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in test mode"** for development
4. Select a location for your database

#### Step 4: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings**
2. Scroll down to **"Your apps"** section
3. Click the web icon `</>` to add a web app
4. Register your app and copy the configuration

#### Step 5: Update Firebase Config

Open `app/lib/firebase.js` and replace with your configuration:

```javascript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};
```

### 4. Environment Variables (Recommended)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

### 5. Firestore Security Rules

Update your Firestore security rules:

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

### 6. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 Troubleshooting

### Firebase Authentication Errors

#### Common Error: `auth/configuration-not-found`

**Solution:**
1. **Add Authorized Domains**
   - Go to Firebase Console → Authentication → Settings
   - Add `localhost` and `127.0.0.1` to authorized domains

2. **Enable Google Provider**
   - Go to Firebase Console → Authentication → Sign-in method
   - Enable Google provider
   - Set a project support email

#### Common Error: `auth/cancelled-popup-request`

**Solution:** This is normal when user closes the popup. No action needed.

#### Common Error: `Failed to get document because the client is offline`

**Solution:**
- Ensure Firestore Database is created and enabled
- Check Firestore security rules
- Verify network connectivity
- App will fallback to localStorage if Firestore is unavailable

### Environment Variables Not Loading

**Solution:**
1. Restart the development server
2. Check that `.env.local` file exists in project root
3. Verify no spaces around `=` in environment variables

### Debug Information

Check browser console for these messages:
- ✅ "Firebase initialized successfully"
- ✅ "Using environment variables: true"
- ✅ "Current domain: localhost"

## 📁 Project Structure

```
shopweb-ecommerce/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── Header.js       # Navigation header
│   │   ├── Footer.js       # Site footer
│   │   └── ProductCard.js  # Product display component
│   ├── context/            # React Context providers
│   │   ├── AuthContext.js  # Authentication state
│   │   └── CartContext.js  # Shopping cart state
│   ├── data/               # Static data and mock data
│   │   └── products.js     # Product catalog
│   ├── lib/                # Utility libraries
│   │   └── firebase.js     # Firebase configuration
│   ├── cart/               # Shopping cart page
│   ├── checkout/           # Checkout process
│   ├── login/              # Authentication page
│   ├── orders/             # Order management
│   ├── products/           # Product catalog pages
│   ├── profile/            # User profile page
│   ├── search/             # Product search
│   └── track-order/        # Order tracking
├── public/                 # Static assets
├── .env.local             # Environment variables
├── package.json           # Dependencies and scripts
└── README.md             # This file
```

## 🎯 Key Features Implementation

### Authentication Flow
- ✅ Google OAuth integration with popup handling
- ✅ User profile management with Firestore
- ✅ Automatic user document creation
- ✅ Session persistence with local storage
- ✅ Protected routes with automatic redirects
- ✅ Improved error handling and user feedback

### Cart Synchronization
- ✅ Real-time cart updates via Firestore
- ✅ Offline support with localStorage fallback
- ✅ Cross-device synchronization
- ✅ Automatic cart loading on login
- ✅ Cart persistence across sessions

### User Interface
- ✅ Profile picture display in navbar
- ✅ Responsive design for all screen sizes
- ✅ Loading states and error handling
- ✅ Smooth animations and transitions
- ✅ Modern color palette (#222831, #393E46, #948979, #DFD0B8)

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Other Platforms

The application can be deployed to any platform that supports Next.js:

| Platform | Documentation |
|----------|---------------|
| **Netlify** | [Next.js on Netlify](https://docs.netlify.com/frameworks/nextjs/) |
| **AWS Amplify** | [Next.js on Amplify](https://docs.aws.amazon.com/amplify/latest/userguide/deploy-nextjs-app.html) |
| **Google Cloud** | [Next.js on GCP](https://cloud.google.com/run/docs/quickstarts/build-and-deploy) |
| **DigitalOcean** | [Next.js on App Platform](https://docs.digitalocean.com/products/app-platform/) |

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m "Add amazing feature"
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Add proper error handling
- Include loading states
- Test on multiple devices
- Update documentation if needed

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Getting Help

- 📖 **Documentation**: Check this README and inline code comments
- 🐛 **Issues**: Open an issue in the GitHub repository
- 💬 **Discussions**: Use GitHub Discussions for questions
- 📧 **Email**: Contact maintainers for urgent issues

### Common Questions

**Q: How do I change the color scheme?**
A: Update the CSS variables in `app/globals.css` and component styles.

**Q: Can I add more payment methods?**
A: Yes! Extend the checkout form in `app/checkout/page.js`.

**Q: How do I add new product categories?**
A: Update the categories in `app/data/products.js` and navigation components.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing framework
- **Firebase Team** for the powerful backend services
- **Tailwind CSS** for the utility-first styling
- **Lucide** for the beautiful icons
- **Vercel** for the seamless deployment experience

---

<div align="center">

**Made with ❤️ by the Mohammed Arif**

</div>