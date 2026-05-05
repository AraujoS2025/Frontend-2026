import React, { createContext, useReducer, type ReactNode } from 'react';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
}

interface AuthContextType extends AuthState {
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

type AuthAction = 
  | { type: 'LOGIN'; payload: string }
  | { type: 'LOGOUT' };

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
};

function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case 'LOGIN':
      return { isAuthenticated: true, user: action.payload };
    case 'LOGOUT':
      return { isAuthenticated: false, user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (username: string, password: string) => {
  if (username === 'admin' && password === '1234') {
    dispatch({ type: 'LOGIN', payload: username });
    return true;
  }
  return false;
};

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};