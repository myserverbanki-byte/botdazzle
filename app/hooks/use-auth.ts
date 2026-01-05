/**
 * Хук для работы с аутентификацией
 * Простая клиентская аутентификация для демонстрации
 */

import { useState, useEffect } from 'react';

const AUTH_KEY = 'admin-authenticated';
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Проверка аутентификации при монтировании
  useEffect(() => {
    const authStatus = localStorage.getItem(AUTH_KEY);
    setIsAuthenticated(authStatus === 'true');
    setIsLoading(false);
  }, []);

  // Вход
  const login = (username: string, password: string): boolean => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  // Выход
  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  };

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}
