'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  attributes?: {
    given_name?: string;
    family_name?: string;
    phone_number?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<void>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resendConfirmationCode: (email: string) => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openSignUpModal: () => void;
  closeSignUpModal: () => void;
  isAuthModalOpen: boolean;
  isSignUpModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);

  useEffect(() => {
    // Check for existing session
    const checkUser = async () => {
      try {
        // This would normally check AWS Cognito session
        // For now, we'll simulate with localStorage
        const savedUser = localStorage.getItem('cfr_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking user session:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Simulate AWS Cognito sign in
      // In production, this would use AWS Amplify Auth
      const mockUser: User = {
        id: '1',
        username: email,
        email,
        attributes: {
          given_name: 'John',
          family_name: 'Churchwell',
          phone_number: '+1234567890',
        },
      };

      localStorage.setItem('cfr_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    try {
      setLoading(true);
      
      // Simulate AWS Cognito sign up
      // In production, this would use AWS Amplify Auth
      console.log('Signing up user:', { email, firstName, lastName, phone });
      
      // For demo purposes, we'll auto-confirm
      const mockUser: User = {
        id: Date.now().toString(),
        username: email,
        email,
        attributes: {
          given_name: firstName,
          family_name: lastName,
          phone_number: phone,
        },
      };

      localStorage.setItem('cfr_user', JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAuthModalOpen(false);
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      localStorage.removeItem('cfr_user');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    try {
      setLoading(true);
      // Simulate confirmation
      console.log('Confirming sign up:', { email, code });
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resendConfirmationCode = async (email: string) => {
    try {
      // Simulate resending code
      console.log('Resending confirmation code to:', email);
    } catch (error) {
      console.error('Resend error:', error);
      throw error;
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);
  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeSignUpModal = () => setIsSignUpModalOpen(false);

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendConfirmationCode,
    openAuthModal,
    closeAuthModal,
    openSignUpModal,
    closeSignUpModal,
    isAuthModalOpen,
    isSignUpModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};