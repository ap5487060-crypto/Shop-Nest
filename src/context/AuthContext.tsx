import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  signInAnonymously,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (name: string, email: string, pass: string) => Promise<void>;
  loginGuest: () => Promise<void>;
  loginDemoAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  adminPasscodeVerified: boolean;
  verifyAdminPasscode: (passcode: string) => boolean;
  lockAdmin: () => void;
  updateUserRole: (newRole: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPER_ADMIN_EMAILS = [
  'ap547060@gmail.com',
  'vijayprajapati3332@gmail.com'
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('shopnest_user_profile');
    return cached ? JSON.parse(cached) : null;
  });
  const [loading, setLoading] = useState(true);
  const [adminPasscodeVerified, setAdminPasscodeVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('shopnest_admin_unlocked') === 'true';
  });

  const checkRole = (email?: string | null): UserRole => {
    if (!email) return 'customer';
    const lower = email.trim().toLowerCase();
    if (SUPER_ADMIN_EMAILS.includes(lower)) return 'super_admin';
    return 'customer';
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const detectedRole = checkRole(currentUser.email);
        if (currentUser.email && SUPER_ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
          sessionStorage.setItem('shopnest_admin_unlocked', 'true');
          setAdminPasscodeVerified(true);
        }
        const profile: UserProfile = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || (currentUser.isAnonymous ? 'Guest Shopper' : 'ShopNest User'),
          photoURL: currentUser.photoURL,
          role: detectedRole,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        };

        // Try syncing profile to Firestore, gracefully ignore if security rules are unconfigured
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            profile.role = detectedRole === 'super_admin' ? 'super_admin' : (data.role || detectedRole);
          } else {
            await setDoc(userDocRef, profile, { merge: true });
          }
        } catch {
          // Fallback to local profile when Firestore rules block write
        }

        setUserProfile(profile);
        localStorage.setItem('shopnest_user_profile', JSON.stringify(profile));
      } else {
        setUserProfile(null);
        localStorage.removeItem('shopnest_user_profile');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const trimmedPass = pass.trim();
    const isOwner = SUPER_ADMIN_EMAILS.includes(cleanEmail);
    const isOwnerPass = trimmedPass === 'Abhishek@8957' || trimmedPass === 'Abhishek@' || trimmedPass === (import.meta.env.VITE_ADMIN_PASSCODE || 'Abhishek@8957');

    if (isOwner && isOwnerPass) {
      sessionStorage.setItem('shopnest_admin_unlocked', 'true');
      setAdminPasscodeVerified(true);
      const adminProfile: UserProfile = {
        uid: 'founder-ap547060',
        email: cleanEmail,
        displayName: 'Abhishek (ShopNest Owner & Admin)',
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setUserProfile(adminProfile);
      localStorage.setItem('shopnest_user_profile', JSON.stringify(adminProfile));
      try {
        await signInWithEmailAndPassword(auth, email, pass);
      } catch {
        // Fallback smooth if user doesn't exist yet in Firebase Auth
      }
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, pass);
      if (isOwner) {
        sessionStorage.setItem('shopnest_admin_unlocked', 'true');
        setAdminPasscodeVerified(true);
      }
    } catch (err: any) {
      if (isOwner && isOwnerPass) {
        sessionStorage.setItem('shopnest_admin_unlocked', 'true');
        setAdminPasscodeVerified(true);
        return;
      }
      throw err;
    }
  };

  const signup = async (name: string, email: string, pass: string) => {
    const credential = await createUserWithEmailAndPassword(auth, email, pass);
    if (credential.user) {
      await updateProfile(credential.user, { displayName: name });
      const detectedRole = checkRole(email);
      if (detectedRole === 'super_admin') {
        sessionStorage.setItem('shopnest_admin_unlocked', 'true');
        setAdminPasscodeVerified(true);
      }
      const profile: UserProfile = {
        uid: credential.user.uid,
        email,
        displayName: name,
        role: detectedRole,
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setUserProfile(profile);
      localStorage.setItem('shopnest_user_profile', JSON.stringify(profile));
    }
  };

  const loginGuest = async () => {
    try {
      await signInAnonymously(auth);
    } catch {
      // Local fallback for guest
      const guestProfile: UserProfile = {
        uid: 'guest-' + Date.now(),
        email: null,
        displayName: 'Guest Shopper',
        role: 'customer',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      };
      setUserProfile(guestProfile);
      localStorage.setItem('shopnest_user_profile', JSON.stringify(guestProfile));
    }
  };

  const loginDemoAdmin = async () => {
    const adminProfile: UserProfile = {
      uid: 'founder-ap547060',
      email: 'ap547060@gmail.com',
      displayName: 'Abhishek (ShopNest Founder & Admin)',
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    };
    setUserProfile(adminProfile);
    localStorage.setItem('shopnest_user_profile', JSON.stringify(adminProfile));
    sessionStorage.setItem('shopnest_admin_unlocked', 'true');
    setAdminPasscodeVerified(true);
  };

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Ignore
    }
    setUser(null);
    setUserProfile(null);
    localStorage.removeItem('shopnest_user_profile');
    sessionStorage.removeItem('shopnest_admin_unlocked');
    setAdminPasscodeVerified(false);
  };

  const verifyAdminPasscode = (passcode: string): boolean => {
    const entered = passcode.trim();
    const envPasscode = import.meta.env.VITE_ADMIN_PASSCODE || 'Abhishek@8957';
    if (
      entered === 'Abhishek@8957' ||
      entered === 'Abhishek@' ||
      entered === envPasscode
    ) {
      sessionStorage.setItem('shopnest_admin_unlocked', 'true');
      setAdminPasscodeVerified(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    sessionStorage.removeItem('shopnest_admin_unlocked');
    setAdminPasscodeVerified(false);
  };

  const updateUserRole = (newRole: UserRole) => {
    if (userProfile) {
      const updated = { ...userProfile, role: newRole };
      setUserProfile(updated);
      localStorage.setItem('shopnest_user_profile', JSON.stringify(updated));
    }
  };

  const isOwnerEmail = 
    (user?.email && SUPER_ADMIN_EMAILS.includes(user.email.toLowerCase())) ||
    (userProfile?.email && SUPER_ADMIN_EMAILS.includes(userProfile.email.toLowerCase()));

  const isAdmin = adminPasscodeVerified || Boolean(isOwnerEmail) || userProfile?.role === 'admin' || userProfile?.role === 'super_admin';
  const isSuperAdmin = adminPasscodeVerified || Boolean(isOwnerEmail) || userProfile?.role === 'super_admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAdmin,
        isSuperAdmin,
        login,
        signup,
        loginGuest,
        loginDemoAdmin,
        logout,
        adminPasscodeVerified,
        verifyAdminPasscode,
        lockAdmin,
        updateUserRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
