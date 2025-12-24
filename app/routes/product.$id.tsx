/**
 * Детальная страница продукта
 */

import { Link, useParams } from 'react-router';
import type { Route } from './+types/product.$id';
import { useProducts } from '~/hooks/use-products';
import { Calculator } from '~/components/calculator';
import { formatCurrency } from '~/utils/calculator';
import styles from './product.$id.module.css';

export function meta({ params }: Route.MetaArgs) {
  return [
    { title: 'Детали продукта - FinCatalog' },
    { name: 'description', content: 'Подробная информация о финансовом продукте' },
  ];
}

export default function ProductDetail() {
  const { id } = useParams();
  const { getProductById } = useProducts();

  if (!id) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>❌</div>
          <h2 className={styles.notFoundTitle}>Продукт не найден</h2>
          <p className={styles.notFoundText}>
            Запрошенный продукт не существует или был удален.
          </p>
          <Link to="/" className={styles.backButton}>
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const product = getProductById(id);

  if (!product) {
    return (
      <div className={styles.page}>
        <div className={styles.notFound}>
          <div className={styles.notFoundIcon}>🔍</div>
          <h2 className={styles.notFoundTitle}>Продукт не найден</h2>
          <p className={styles.notFoundText}>
            Запрошенный продукт не существует или был удален.
          </p>
          <Link to="/" className={styles.backButton}>
            ← Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  // Рендер деталей в зависимости от типа продукта
  const renderDetails = () => {
    switch (product.category) {
      case 'credit':
        return (
          <>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Процентная ставка</div>
              <div className={styles.detailValue}>от {product.interestRate}%</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Сумма</div>
              <div className={styles.detailValue}>
                {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Срок кредита</div>
              <div className={styles.detailValue}>до {product.termMonths} мес.</div>
            </div>
          </>
        );

      case 'deposit':
        return (
          <>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Процентная ставка</div>
              <div className={styles.detailValue}>до {product.interestRate}%</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Сумма</div>
              <div className={styles.detailValue}>
                {product.minAmount === 0 ? 'Без мин.' : formatCurrency(product.minAmount)} -{' '}
                {formatCurrency(product.maxAmount)}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Срок вклада</div>
              <div className={styles.detailValue}>до {product.termMonths} мес.</div>
            </div>
          </>
        );

      case 'credit-card':
        return (
          <>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Процентная ставка</div>
              <div className={styles.detailValue}>от {product.interestRate}%</div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Кредитный лимит</div>
              <div className={styles.detailValue}>
                до {formatCurrency(product.maxAmount)}
              </div>
            </div>
            <div className={styles.detailItem}>
              <div className={styles.detailLabel}>Льготный период</div>
              <div className={styles.detailValue}>до {product.gracePeriodDays} дней</div>
            </div>
          </>
        );

      case 'debit-card':
        return null;

      case 'promo':
        return null;
    }
  };

  const showCalculator =
    product.category === 'credit' ||
    product.category === 'credit-card' ||
    product.category === 'deposit';

  return (
    <div className={styles.page}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/" className={styles.backButton}>
            <span>←</span>
            <span>Назад</span>
          </Link>
        </div>
      </header>

      {/* Основной контент */}
      <main className={styles.main}>
        <div className={styles.productCard}>
          {/* Изображение */}
          <div className={styles.imageWrapper}>
            <img
              src={product.imageUrl}
              alt={product.productName}
              className={styles.image}
            />
            {product.isFeatured && (
              <div className={styles.featuredBadge}>⭐ ТОП</div>
            )}
          </div>

          {/* Контент */}
          <div className={styles.content}>
            <div className={styles.bankName}>{product.bankName}</div>
            <h1 className={styles.productName}>{product.productName}</h1>

            {/* Детали */}
            {renderDetails() && (
              <div className={styles.details}>{renderDetails()}</div>
            )}

            {/* Преимущества (для дебетовых карт) */}
            {product.category === 'debit-card' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>💎 Преимущества</h2>
                <p className={styles.conditions}>{product.benefits}</p>
              </div>
            )}

            {/* Описание (для промо-акций) */}
            {product.category === 'promo' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📋 Описание акции</h2>
                <p className={styles.conditions}>{product.description}</p>
                {product.validUntil && (
                  <p className={styles.conditions}>
                    <strong>⏰ Действует до:</strong>{' '}
                    {new Date(product.validUntil).toLocaleDateString('ru-RU')}
                  </p>
                )}
              </div>
            )}

            {/* Условия */}
            {'conditions' in product && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>📋 Условия</h2>
                <p className={styles.conditions}>{product.conditions}</p>
              </div>
            )}

            {/* Кнопка оформления */}
            <div className={styles.actions}>
              <a
                href={product.applicationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.applyButton}
              >
                <span>Оформить онлайн</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Калькулятор */}
        {showCalculator && (
          <Calculator
            product={
              product as
                | (typeof product & { category: 'credit' })
                | (typeof product & { category: 'credit-card' })
                | (typeof product & { category: 'deposit' })
            }
          />
        )}
      </main>
    </div>
  );
}
