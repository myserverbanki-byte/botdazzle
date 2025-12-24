/**
 * Дашборд админ-панели
 */

import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import type { Route } from './+types/admin.dashboard';
import { useAuth } from '~/hooks/use-auth';
import { useProducts } from '~/hooks/use-products';
import styles from './admin.dashboard.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Админ-панель - FinCatalog' },
    { name: 'description', content: 'Управление финансовыми продуктами' },
  ];
}

const categoryLabels: Record<string, string> = {
  credit: 'Кредит',
  deposit: 'Вклад',
  'debit-card': 'Дебетовая карта',
  'credit-card': 'Кредитная карта',
  promo: 'Акция',
};

const categoryBadgeClass: Record<string, string> = {
  credit: styles.badgeCredit,
  deposit: styles.badgeDeposit,
  'debit-card': styles.badgeDebitCard,
  'credit-card': styles.badgeCreditCard,
  promo: styles.badgePromo,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { products, deleteProduct, toggleFeatured } = useProducts();

  // Проверка аутентификации
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [authLoading, isAuthenticated, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleDelete = (id: string, productName: string) => {
    if (confirm(`Вы уверены, что хотите удалить "${productName}"?`)) {
      deleteProduct(id);
    }
  };

  // Статистика
  const stats = {
    total: products.length,
    credits: products.filter((p) => p.category === 'credit').length,
    deposits: products.filter((p) => p.category === 'deposit').length,
    cards: products.filter(
      (p) => p.category === 'debit-card' || p.category === 'credit-card'
    ).length,
    promos: products.filter((p) => p.category === 'promo').length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  if (authLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Загрузка...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.logo}>🏦</div>
            <h1 className={styles.title}>FinCatalog Admin</h1>
          </div>
          <div className={styles.headerRight}>
            <Link to="/" className={styles.headerButton}>
              <span>🏠</span>
              <span>На сайт</span>
            </Link>
            <button onClick={handleLogout} className={`${styles.headerButton} ${styles.logoutButton}`}>
              <span>🚪</span>
              <span>Выйти</span>
            </button>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className={styles.main}>
        {/* Статистика */}
        <div className={styles.stats}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Всего продуктов</div>
            <div className={styles.statValue}>{stats.total}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>В топе</div>
            <div className={styles.statValue}>{stats.featured}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Кредиты</div>
            <div className={styles.statValue}>{stats.credits}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Вклады</div>
            <div className={styles.statValue}>{stats.deposits}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Карты</div>
            <div className={styles.statValue}>{stats.cards}</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>Акции</div>
            <div className={styles.statValue}>{stats.promos}</div>
          </div>
        </div>

        {/* Тулбар */}
        <div className={styles.toolbar}>
          <h2>Управление продуктами</h2>
          <Link to="/admin/product/new" className={styles.addButton}>
            <span>➕</span>
            <span>Добавить продукт</span>
          </Link>
        </div>

        {/* Таблица продуктов */}
        <div className={styles.tableWrapper}>
          {products.length > 0 ? (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Изображение</th>
                  <th>Банк</th>
                  <th>Название</th>
                  <th>Категория</th>
                  <th>Топ</th>
                  <th>Дата создания</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <img
                        src={product.imageUrl}
                        alt={product.productName}
                        className={styles.productImage}
                      />
                    </td>
                    <td>{product.bankName}</td>
                    <td>
                      <strong>{product.productName}</strong>
                    </td>
                    <td>
                      <span
                        className={`${styles.badge} ${
                          categoryBadgeClass[product.category]
                        }`}
                      >
                        {categoryLabels[product.category]}
                      </span>
                    </td>
                    <td>
                      <span
                        className={styles.featuredToggle}
                        onClick={() => toggleFeatured(product.id)}
                        title={
                          product.isFeatured
                            ? 'Убрать из топа'
                            : 'Добавить в топ'
                        }
                      >
                        {product.isFeatured ? '⭐' : '☆'}
                      </span>
                    </td>
                    <td>
                      {new Date(product.createdAt).toLocaleDateString('ru-RU')}
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <Link
                          to={`/admin/product/${product.id}/edit`}
                          className={styles.actionButton}
                        >
                          ✏️ Изменить
                        </Link>
                        <button
                          onClick={() =>
                            handleDelete(product.id, product.productName)
                          }
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                        >
                          🗑️ Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className={styles.emptyState}>
              <p>Нет продуктов. Добавьте первый продукт.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
