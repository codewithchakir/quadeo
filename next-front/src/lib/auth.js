export const setAuthToken = (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };
  
  export const getAuthToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  export const setUserData = (user) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  };
  
  export const getUserData = () => {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  };
  
  export const removeAuthData = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  };
  
  export const isAuthenticated = () => {
    return !!getAuthToken();
  };
  
  export const getUserRole = () => {
    const user = getUserData();
    return user ? user.role : null;
  };