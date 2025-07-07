'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Amplify } from 'aws-amplify';
import { signUp as amplifySignUp, signIn as amplifySignIn, signOut as amplifySignOut, getCurrentUser, fetchUserAttributes, confirmSignUp as amplifyConfirmSignUp, resetPassword as amplifyResetPassword, confirmResetPassword as amplifyConfirmResetPassword } from 'aws-amplify/auth';
import outputs from '@/amplify_outputs.json';
import { checkUserApproval } from '@/lib/approved-users';
import { addPendingUser } from '@/lib/cognito-users';
import { formatPhoneForCognito } from '@/lib/phone-utils';


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
  signUp: (email: string, password: string, firstName: string, lastName: string, phone: string) => Promise<{ nextStep: any }>;
  signOut: () => Promise<void>;
  confirmSignUp: (email: string, code: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
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


  // Configure Amplify on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      Amplify.configure(outputs);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        const userEmail = userAttributes.email || '';
        
        setUser({
          id: currentUser.userId,
          username: currentUser.username,
          email: userEmail,
          attributes: {
            given_name: userAttributes.given_name || '',
            family_name: userAttributes.family_name || '',
            phone_number: userAttributes.phone_number || ''
          }
        });
      } catch (error) {
        console.log('No authenticated user');
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await amplifySignIn({ username: email, password });
      
      if (result.isSignedIn) {
        const currentUser = await getCurrentUser();
        const userAttributes = await fetchUserAttributes();
        
        const userEmail = userAttributes.email || email;
        
        setUser({
          id: currentUser.userId,
          username: currentUser.username,
          email: userEmail,
          attributes: {
            given_name: userAttributes.given_name || '',
            family_name: userAttributes.family_name || '',
            phone_number: userAttributes.phone_number || ''
          }
        });
        
        // Check approval status from DynamoDB
        const isApproved = await checkUserApproval(userEmail);
        if (!isApproved) {
          // Add to pending users list for admin review
          addPendingUser({
            username: currentUser.username,
            email: userEmail,
            givenName: userAttributes.given_name,
            familyName: userAttributes.family_name,
            phoneNumber: userAttributes.phone_number,
            userCreateDate: new Date(),
            userStatus: 'CONFIRMED'
          });
          throw new Error('ACCOUNT_PENDING_APPROVAL');
        }
        setIsAuthModalOpen(false);
        
        // Check if this is an admin login and redirect
        if (userAttributes.email === 'mudge.andrew@gmail.com' && window.location.search.includes('admin=true')) {
          window.location.href = '/admin';
        }
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, firstName: string, lastName: string, phone: string) => {
    setLoading(true);
    try {
      // Format phone number to E.164 format for Cognito
      const formattedPhone = formatPhoneForCognito(phone);
      
      const result = await amplifySignUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            phone_number: formattedPhone,
            given_name: firstName,
            family_name: lastName
          }
        }
      });
      
      return { nextStep: result.nextStep };
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
      await amplifySignOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmSignUp = async (email: string, code: string) => {
    setLoading(true);
    try {
      await amplifyConfirmSignUp({ username: email, confirmationCode: code });
    } catch (error) {
      console.error('Confirmation error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    setLoading(true);
    try {
      await amplifyResetPassword({ username: email });
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const confirmResetPassword = async (email: string, code: string, newPassword: string) => {
    setLoading(true);
    try {
      await amplifyConfirmResetPassword({ username: email, confirmationCode: code, newPassword });
    } catch (error) {
      console.error('Confirm reset password error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);


  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resetPassword,
    confirmResetPassword,
    openAuthModal,
    closeAuthModal,
    isAuthModalOpen,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};