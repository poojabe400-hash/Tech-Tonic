import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import {
  auth,
  isFirebaseLive,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
} from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('careerbridge_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Restore authenticated session on page load
  useEffect(() => {
    const restoreSession = async () => {
      const storedToken = localStorage.getItem('careerbridge_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.post('/auth/verify', { token: storedToken });
        if (res.success && res.data) {
          setUser(res.data.user);
          setProfile(res.data.profile);
          setToken(storedToken);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification fallback:', err.message);
        // If offline or invalid, clear
        logout();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email, password, rememberMe = true) => {
    setError(null);
    try {
      let idToken = null;

      // 1. If Live Firebase is available, perform client-side Firebase Auth first
      if (isFirebaseLive && auth) {
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          idToken = await userCredential.user.getIdToken();
        } catch (fbErr) {
          console.warn('Firebase client auth error:', fbErr.message);
          // Allow fallback to backend authentication (e.g. for demo credentials)
        }
      }

      // 2. Authenticate with Backend REST API (verifies Firebase token or demo credentials)
      const res = await api.post('/auth/login', {
        email,
        password,
        id_token: idToken,
      });

      if (res.success && res.data) {
        const receivedToken = res.data.token;
        setUser(res.data.user);
        setProfile(res.data.profile);
        setToken(receivedToken);

        if (rememberMe) {
          localStorage.setItem('careerbridge_token', receivedToken);
        } else {
          sessionStorage.setItem('careerbridge_token', receivedToken);
        }
        return { success: true, user: res.data.user };
      } else {
        throw new Error(res.message || 'Login failed');
      }
    } catch (err) {
      const msg = err.message || 'Login failed. Please check your credentials.';
      setError(msg);
      throw err;
    }
  };

  const register = async (formData) => {
    setError(null);
    try {
      let firebaseUid = null;

      // 1. Live Firebase User Creation if enabled
      if (isFirebaseLive && auth) {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
          firebaseUid = userCredential.user.uid;
          await sendEmailVerification(userCredential.user);
        } catch (fbErr) {
          console.warn('Firebase registration notice:', fbErr.message);
        }
      }

      // 2. Create in Backend database
      const res = await api.post('/auth/register', {
        ...formData,
        firebase_uid: firebaseUid,
      });

      if (res.success && res.data) {
        const receivedToken = res.data.token;
        setUser(res.data.user);
        setProfile(res.data.profile);
        setToken(receivedToken);
        localStorage.setItem('careerbridge_token', receivedToken);
        return { success: true, data: res.data };
      } else {
        throw new Error(res.message || 'Registration failed');
      }
    } catch (err) {
      const msg = err.message || 'Registration failed.';
      setError(msg);
      throw err;
    }
  };

  const forgotPassword = async (email) => {
    setError(null);
    try {
      if (isFirebaseLive && auth) {
        try {
          await sendPasswordResetEmail(auth, email);
        } catch (e) {
          console.warn('Firebase reset notice:', e.message);
        }
      }
      return await api.post('/auth/forgot-password', { email });
    } catch (err) {
      throw err;
    }
  };

  const logout = async () => {
    try {
      if (isFirebaseLive && auth) {
        await signOut(auth);
      }
      await api.post('/auth/logout').catch(() => {});
    } catch (e) {
      // ignore
    } finally {
      setUser(null);
      setProfile(null);
      setToken(null);
      localStorage.removeItem('careerbridge_token');
      sessionStorage.removeItem('careerbridge_token');
    }
  };

  // 1-Click Fast Demonstrations for Hackathon Evaluators
  const loginAsDemoStudent = async () => {
    return login('demo.student@careerbridge.ai', 'student123', true);
  };

  const loginAsDemoAdmin = async () => {
    return login('admin@careerbridge.ai', 'admin123', true);
  };

  const updateLocalProfile = (newProfile) => {
    setProfile(newProfile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        error,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        login,
        register,
        forgotPassword,
        logout,
        loginAsDemoStudent,
        loginAsDemoAdmin,
        updateLocalProfile,
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
