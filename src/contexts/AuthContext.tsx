import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  role: string;
  avatar?: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  signOut: () => void;
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

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem('talentflow_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        localStorage.removeItem('talentflow_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Extract name from email for demo purposes
      const emailName = email.split('@')[0];
      const nameParts = emailName.split('.');
      const firstName = nameParts[0] || emailName;
      const lastName = nameParts[1] || 'User';
      
      // Create a user based on login details
      const user: User = {
        id: Date.now().toString(),
        firstName: firstName.charAt(0).toUpperCase() + firstName.slice(1),
        lastName: lastName.charAt(0).toUpperCase() + lastName.slice(1),
        email: email,
        company: 'TechCorp', // Default company for demo
        role: 'HR Manager',
        avatar: undefined
      };

      setUser(user);
      localStorage.setItem('talentflow_user', JSON.stringify(user));
    } catch (error) {
      throw new Error('Sign in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<void> => {
    setIsLoading(true);
    try {
      // Simulate API call - in real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user from signup data
      const newUser: User = {
        id: Date.now().toString(),
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        company: data.company,
        role: 'HR Manager'
      };

      setUser(newUser);
      localStorage.setItem('talentflow_user', JSON.stringify(newUser));
    } catch (error) {
      throw new Error('Sign up failed');
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('talentflow_user');
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
