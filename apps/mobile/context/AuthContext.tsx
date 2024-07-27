import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios'

interface AuthContextType {
  authenticated: boolean;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const queryClient = new QueryClient();

const checkAuthentication = async (): Promise<boolean> => {
  try {
    const response = await axios.get('http://localhost:3000/auth/check');
    
    return response? response.status === 200 : false
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean>(true);
  
  // const { data: isAuthenticated, isLoading } = useQuery({
  //   queryKey: ['authCheck'],
  //   queryFn: checkAuthentication,
  // })

  // const { mutate, isPending } = useMutation({
  //   mutationFn: checkAuthentication,
  //   onMutate: async () => {
  //     await queryClient.cancelQueries(['authCheck'])
  //   }
  // })

  useEffect(() => {
    const fetchAuthStatus = async () => {
      setAuthenticated(await checkAuthentication());
    };
    fetchAuthStatus();
  }, []);

  return (
    // <QueryClientProvider client={queryClient}>
      <AuthContext.Provider value={{ authenticated, setAuthenticated }}>
        {children}
      </AuthContext.Provider>
    // </QueryClientProvider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
