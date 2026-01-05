/**
 * Главная страница каталога финансовых продуктов
 */

import { useState } from 'react';
import type { Route } from './+types/home';
import { useProducts } from '~/hooks/use-products';
import { ProductCard } from '~/components/product-card';
import type { FilterType } from '~/data/types';
import styles from './home.module.css';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'FinCatalog - Каталог финансовых продуктов' },
    {
      name: 'description',
      content: 'Лучшие предложения по кредитам, вкладам, картам и акциям банков',
    },
  ];
}

const filters: { value: FilterType; label: string; icon: string }[] = [
  { value: 'all', label: 'Топ', icon: '⭐' },
  { value: 'promo', label: 'Акции банков', icon: '🎁' },
  { value: 'debit-card', label: 'Дебетовые карты', icon: '💳' },
  { value: 'credit-card', label: 'Кредитные карты', icon: '💳' },
  { value: 'credit', label: 'Кредит наличными', icon: '💵' },
  { value: 'deposit', label: 'Вклады', icon: '💰' },
];

export default function Home() {
  const { products, isLoading, getFeaturedProducts, getProductsByCategory } =
    useProducts();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Получение отфильтрованных продуктов
  const filteredProducts =
    activeFilter === 'all'
      ? getFeaturedProducts()
      : getProductsByCategory(activeFilter);

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>
          <p>Загрузка продуктов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Заголовок */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            <span>🏦</span>
            <span>FinCatalog</span>
          </h1>
          <p className={styles.subtitle}>
            Лучшие финансовые продукты от ведущих банков России
          </p>
        </div>
      </header>

      {/* Фильтры */}
      <div className={styles.filters}>
        <div className={styles.filterButtons}>
          {filters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`${styles.filterButton} ${
                activeFilter === filter.value ? styles.active : ''
              }`}
            >
              <span>{filter.icon}</span> {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Каталог продуктов */}
      <main className={styles.main}>
        {filteredProducts.length > 0 ? (
          <div className={styles.grid}>
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>🔍</div>
            <h2 className={styles.emptyStateTitle}>Продукты не найдены</h2>
            <p className={styles.emptyStateText}>
              В этой категории пока нет продуктов. Попробуйте выбрать другую
              категорию.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
