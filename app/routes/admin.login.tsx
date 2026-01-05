/**
 * Страница входа в админ-панель
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/admin.login';
import { useAuth } from '~/hooks/use-auth';
import styles from './admin.login.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Вход в админ-панель - FinCatalog' },
    { name: 'description', content: 'Авторизация для администраторов' },
  ];
}

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Заполните все поля');
      return;
    }

    const success = login(username, password);
    if (success) {
      navigate('/admin/dashboard', { replace: true });
    } else {
      setError('Неверный логин или пароль');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>🔐</div>
          <h1 className={styles.title}>Админ-панель</h1>
          <p className={styles.subtitle}>FinCatalog</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className={styles.field}>
            <label htmlFor="username" className={styles.label}>
              Логин
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Введите логин"
              className={styles.input}
              autoComplete="username"
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Введите пароль"
              className={styles.input}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Войти
          </button>

          <div className={styles.hint}>
            <strong>Демо-доступ:</strong> admin / admin123
          </div>
        </form>

        <div className={styles.footer}>
          <Link to="/" className={styles.backLink}>
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}
