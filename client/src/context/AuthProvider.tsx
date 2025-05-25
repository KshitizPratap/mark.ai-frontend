import React, { createContext, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { verifyToken } from '@/services/authServices';
import { getValue, STORAGE_KEYS } from '@/commons/storage';
import { useAuthStore } from '@/store/useAuthStore';

interface AuthContextType {
  isVerifying: boolean;
  isAuth: boolean;
  userDetails: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = getValue(STORAGE_KEYS.TOKEN) || "";
  const [, navigate] = useLocation();
  const { setIsAuth, setUserDetails, setIsVerifying, isVerifying, isAuth, userDetails } = useAuthStore();

  useEffect(() => {
    if(token){
      checkUserAuthentication();
    }
  }, []);

  const checkUserAuthentication = async () => {
    setIsVerifying(true);
    try{
      const response = await verifyToken();
      setUserDetails(response);
      setIsAuth(true);
    //   navigate("/dashboard");
    } catch (error){
      setIsAuth(false);
      navigate("/");
    } finally{
      setIsVerifying(false);
    }
  };

  return (
    <AuthContext.Provider value={{ isVerifying, isAuth: isAuth ?? false, userDetails }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider; 