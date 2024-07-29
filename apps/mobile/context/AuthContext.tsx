import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
// import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';

interface AuthContextType {
  authenticated: boolean | undefined;
  setAuthenticated: React.Dispatch<React.SetStateAction<boolean | undefined>>;
}
const validateUrl = process.env.EXPO_PUBLIC_API_URL_DEV + '/auth/validate'

const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const queryClient = new QueryClient();

const checkAuthentication = async (token: string | null): Promise<boolean> => {
  try {
    const response = await axios.get(validateUrl, {
      headers: {
        Authorization: token,
      },
    });
    
    return response? response.status === 200 : false
  } catch (error) {
    console.error('Error checking authentication status:', error);
    return false;
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  
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
      try {
        const token = await SecureStore.getItemAsync('authToken');
        
        const isAuthenticated = await checkAuthentication(token);
        setAuthenticated(isAuthenticated);
      } catch (error) {
        console.error('Error fetching authentication status:', error);
        setAuthenticated(false);
      }
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
