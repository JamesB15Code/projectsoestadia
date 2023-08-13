import { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Función para guardar los datos de usuario en el localStorage
  const saveUserDataToLocal = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('nombre', user.nombre);
    localStorage.setItem('correo', user.correo);
    localStorage.setItem('username', user.username);
    localStorage.setItem('pregunta', user.pregunta);
    localStorage.setItem('respuesta', user.respuesta);
    localStorage.setItem('rol', user.rol);
    localStorage.setItem('idUsuario', user.idUsuarios);
    setIsAuthenticated(true);
  };

  // Función para obtener los datos de usuario del localStorage
  const getUserDataFromLocal = () => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      setIsAuthenticated(true);
    }
  };

  useEffect(() => {
    getUserDataFromLocal();
  }, []);

  const login = (user) => {
    saveUserDataToLocal(user);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('nombre');
    localStorage.removeItem('correo');
    localStorage.removeItem('username');
    localStorage.removeItem('pregunta');
    localStorage.removeItem('respuesta');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    setIsAuthenticated(false);
    setUser(null);
  };

  const authContextData = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={authContextData}>
      {children}
    </AuthContext.Provider>
  );
};
