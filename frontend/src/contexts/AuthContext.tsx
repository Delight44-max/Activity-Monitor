'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
  type ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';
import { authService } from '@/src/services/auth.service';
import { connectSocket, disconnectSocket } from '@/src/services/socket.service';
import { setAuthChecking } from '@/src/services/api';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleProvider } from '@/src/lib/firebase';
import { User } from '@/src/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const checkingRef = useRef(false);

  const checkAuth = useCallback(async () => {
    // Prevent multiple simultaneous auth checks
    if (checkingRef.current) {
      return;
    }
    checkingRef.current = true;
    setAuthChecking(true);

    try {
      const token = Cookies.get('token');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      
      const profile = await authService.getProfile();
      setUser(profile);
      connectSocket();
    } catch (error: any) {
      // Only remove token if it's an authentication error (401)
      // Preserve token on network errors, timeouts, etc.
      const status = error.response?.status;
      if (status === 401) {
        Cookies.remove('token');
        setUser(null);
      } else {
        // For network errors or other issues, keep the token
        // and retry after a short delay
        console.warn('Auth check failed, retrying in 2s...', error.message);
        setTimeout(() => checkAuth(), 2000);
      }
    } finally {
      setLoading(false);
      checkingRef.current = false;
      setAuthChecking(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    
    const initAuth = async () => {
      await checkAuth();
    };

    initAuth();

    return () => {
      mounted = false;
    };
  }, [checkAuth]);

  const login = useCallback(
    async (email: string, password: string) => {
      // Reset auth checking flag before login
      setAuthChecking(false);
      
      const response = await authService.login({ email, password });
      Cookies.set('token', response.token, { expires: 7, secure: false, sameSite: 'lax' });
      setUser(response.user);
      connectSocket();
      toast.success(`Welcome back, ${response.user.firstName}!`);
      router.push('/dashboard');
    },
    [router],
  );

  const loginWithGoogle = useCallback(async () => {
    try {
      // Reset auth checking flag before login
      setAuthChecking(false);
      
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const response = await authService.googleLogin(idToken);
      Cookies.set('token', response.token, { expires: 7, secure: false, sameSite: 'lax' });
      setUser(response.user);
      connectSocket();
      toast.success(`Welcome, ${response.user.firstName}!`);
      router.push('/dashboard');
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        return;
      }
      if (error.code === 'auth/configuration-not-found') {
        toast.error('Google sign-in is not configured. Please check your Firebase configuration.');
        console.error('Firebase config error: Ensure NEXT_PUBLIC_FIREBASE_API_KEY and other Firebase env vars are set correctly in frontend/.env');
      } else if (error.code === 'auth/api-key-not-valid') {
        toast.error('Google sign-in failed: Invalid Firebase API key. Please update your Firebase configuration.');
        console.error('Firebase API key is invalid. Update NEXT_PUBLIC_FIREBASE_API_KEY in frontend/.env');
      } else if (error.code === 'auth/unauthorized-domain') {
        toast.error('This domain is not authorized for Google sign-in. Add it in Firebase Console.');
      } else {
        toast.error(`Google sign-in failed: ${error.message || 'Please try again.'}`);
        console.error('Google sign-in error:', error);
      }
    }
  }, [router]);

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
      confirmPassword: string,
    ) => {
      // Reset auth checking flag before login
      setAuthChecking(false);
      
      const response = await authService.register({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
      });
      Cookies.set('token', response.token, { expires: 7, secure: false, sameSite: 'lax' });
      setUser(response.user);
      connectSocket();
      toast.success('Account created successfully!');
      router.push('/dashboard');
    },
    [router],
  );

  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Even if API call fails, log out locally
    } finally {
      disconnectSocket();
      Cookies.remove('token');
      setUser(null);
      toast.success('Logged out successfully');
      router.push('/');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}