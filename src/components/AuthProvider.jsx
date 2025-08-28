import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // Load auth state from localStorage on app initialization
  useEffect(() => {
    console.log('🚀 AUTH PROVIDER - Starting auth state load');
    
    const loadAuthState = () => {
      try {
        console.log('🔍 AUTH PROVIDER - Loading auth state from localStorage');
        
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');
        const expiry = localStorage.getItem('authExpiry');
        const now = Date.now();

        console.log('🔍 AUTH PROVIDER - LocalStorage check:', {
          hasUser: !!storedUser,
          hasToken: !!storedToken,
          hasExpiry: !!expiry,
          currentTime: new Date(now).toISOString(),
          expiryTime: expiry ? new Date(Number(expiry)).toISOString() : 'N/A'
        });

        // Check if token exists and is not expired
        if (storedUser && storedToken && expiry) {
          if (now > Number(expiry)) {
            // Token expired, clear storage
            console.log('❌ AUTH PROVIDER - Token expired, clearing storage');
            console.log('❌ Expiry time:', new Date(Number(expiry)).toISOString());
            console.log('❌ Current time:', new Date(now).toISOString());
            
            localStorage.removeItem('user');
            localStorage.removeItem('authToken');
            localStorage.removeItem('authExpiry');
            setUser(null);
            setIsAuthenticated(false);
            setIsAdmin(false);
            
            console.log('❌ AUTH PROVIDER - Auth state cleared due to expiry');
          } else {
            // Valid token, restore user state
            console.log('✅ AUTH PROVIDER - Valid token found, restoring user state');
            
            const userData = JSON.parse(storedUser);
            console.log('✅ AUTH PROVIDER - User data:', {
              username: userData.username,
              email: userData.email,
              roles: userData.roles,
              hasToken: !!userData.token
            });
            
            setUser(userData);
            setIsAuthenticated(true);
            setIsAdmin(userData.roles?.includes('ROLE_ADMIN') || false);
            
            console.log('✅ AUTH PROVIDER - Auth state restored successfully');
            console.log('✅ Time until expiry:', Math.round((Number(expiry) - now) / (1000 * 60)), 'minutes');
          }
        } else {
          // No valid session found
          console.log('⚠️ AUTH PROVIDER - No valid session found');
          console.log('⚠️ Missing:', {
            user: !storedUser,
            token: !storedToken,
            expiry: !expiry
          });
          
          setUser(null);
          setIsAuthenticated(false);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('❌ AUTH PROVIDER - Error loading auth state:', error);
        // Clear corrupted data
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
        localStorage.removeItem('authExpiry');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      } finally {
        console.log('🏁 AUTH PROVIDER - Auth state loading complete');
        setIsLoading(false);
      }
    };

    loadAuthState();
  }, []);

  const login = (userData) => {
    try {
      console.log('🔑 AUTH PROVIDER - Login called with userData:', {
        username: userData.username,
        email: userData.email,
        roles: userData.roles,
        hasToken: !!userData.token,
        receivedData: userData // Log full object to debug
      });
      
      setUser(userData);
      setIsAuthenticated(true);
      setIsAdmin(userData.roles?.includes('ROLE_ADMIN') || false);
      
      // Persist to localStorage with 5-hour expiry
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Check if token exists in userData or separately
      const token = userData.token || userData.accessToken || userData.authToken;
      if (token) {
        localStorage.setItem('authToken', token);
        // Set expiry for 5 hours from now
        const expiry = Date.now() + (5 * 60 * 60 * 1000);
        localStorage.setItem('authExpiry', expiry.toString());
        
        console.log('✅ AUTH PROVIDER - Login successful');
        console.log('✅ Token saved with expiry:', new Date(expiry).toISOString());
        console.log('✅ Token expires in 5 hours');
      } else {
        console.log('❌ AUTH PROVIDER - No token in userData!');
        console.log('❌ Available keys:', Object.keys(userData));
        console.log('❌ Full userData:', userData);
      }
    } catch (error) {
      console.error('❌ AUTH PROVIDER - Error during login:', error);
    }
  };

  const logout = () => {
    console.log('🚪 AUTH PROVIDER - Logout called');
    
    setUser(null);
    setIsAuthenticated(false);
    setIsAdmin(false);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authExpiry');
    
    console.log('✅ AUTH PROVIDER - Logout complete, storage cleared');
  };

  const updateUser = (updatedUserData) => {
    try {
      console.log('🔄 AUTH PROVIDER - Update user called:', {
        username: updatedUserData.username,
        email: updatedUserData.email,
        roles: updatedUserData.roles
      });
      
      setUser(updatedUserData);
      setIsAdmin(updatedUserData.roles?.includes('ROLE_ADMIN') || false);
      
      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUserData));
      
      console.log('✅ AUTH PROVIDER - User updated successfully');
    } catch (error) {
      console.error('❌ AUTH PROVIDER - Error updating user:', error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    isLoading,
    login,
    logout,
    updateUser,
  };

  // Show loading spinner while checking auth state
  if (isLoading) {
    console.log('⏳ AUTH PROVIDER - Showing loading screen');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-pink-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  console.log('🎯 AUTH PROVIDER - Rendering with state:', {
    isAuthenticated,
    isAdmin,
    hasUser: !!user,
    username: user?.username
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
