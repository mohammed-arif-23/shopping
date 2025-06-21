"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  browserPopupRedirectResolver,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth"
import { 
  doc, 
  setDoc, 
  getDoc, 
  serverTimestamp,
  enableNetwork,
  disableNetwork
} from "firebase/firestore"
import { auth, googleProvider, db } from "../lib/firebase"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // Set persistence to local (survives browser restarts)
  useEffect(() => {
    setPersistence(auth, browserLocalPersistence).catch((error) => {
      console.warn("Could not set auth persistence:", error)
    })
  }, [])

  // Check network connectivity
  useEffect(() => {
    const checkNetwork = async () => {
      try {
        await enableNetwork(db)
        setIsOnline(true)
      } catch (error) {
        console.warn("Network connection issue:", error)
        setIsOnline(false)
      }
    }

    checkNetwork()
  }, [])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check if user exists in Firestore, if not create them
          const userRef = doc(db, "users", firebaseUser.uid)
          
          // Try to get user document
          let userSnap
          try {
            userSnap = await getDoc(userRef)
          } catch (firestoreError) {
            console.warn("Firestore connection issue:", firestoreError)
            // If Firestore is offline, still set user but don't try to update
            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              photoURL: firebaseUser.photoURL
            })
            setLoading(false)
            return
          }
          
          if (!userSnap.exists()) {
            // Create new user document
            try {
              await setDoc(userRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                createdAt: serverTimestamp(),
                lastLogin: serverTimestamp()
              })
            } catch (setDocError) {
              console.warn("Could not create user document:", setDocError)
              // Continue even if Firestore is unavailable
            }
          } else {
            // Update last login
            try {
              await setDoc(userRef, {
                lastLogin: serverTimestamp()
              }, { merge: true })
            } catch (updateError) {
              console.warn("Could not update user document:", updateError)
              // Continue even if Firestore is unavailable
            }
          }

          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          })
        } catch (error) {
          console.error("Error updating user data:", error)
          // Still set user even if Firestore update fails
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL
          })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async () => {
    if (isLoggingIn) {
      console.log("Login already in progress")
      return null
    }

    setIsLoggingIn(true)
    
    try {
      // Configure auth to use popup redirect resolver
      auth.useDeviceLanguage()
      
      const result = await signInWithPopup(auth, googleProvider)
      return result.user
    } catch (error) {
      console.error("Login error:", error)
      
      // Handle specific error types
      if (error.code === 'auth/cancelled-popup-request') {
        console.log("Login popup was cancelled by user")
        return null
      } else if (error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed by user")
        return null
      } else if (error.code === 'auth/configuration-not-found') {
        console.error("Firebase configuration error. Please check your Firebase setup.")
        throw new Error("Authentication configuration error. Please try again later.")
      } else {
        throw new Error("Login failed. Please try again.")
      }
    } finally {
      setIsLoggingIn(false)
    }
  }

  const logout = async () => {
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  const value = {
    user,
    login,
    logout,
    loading,
    isLoggingIn,
    isOnline
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
