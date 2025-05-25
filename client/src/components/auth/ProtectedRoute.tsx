import React from 'react';
import { Route, useLocation } from 'wouter';
import { useAuthStore } from '@/store/useAuthStore';

type ProtectedRouteProps = {
  path: string;
  component: React.ComponentType;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  path, 
  component: Component 
}) => {
  const { isAuth } = useAuthStore();
  const [, navigate] = useLocation();

  return (
    <Route path={path}>
      {() => {
        if (isAuth === false) {
          navigate("/");
          return null;
        }

        return <Component />;
      }}
    </Route>
  );
};