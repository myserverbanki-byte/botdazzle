/**
 * Компонент карточки продукта
 * Универсальная карточка для всех типов финансовых продуктов
 */

import { Link } from 'react-router';
import type { Product } from '~/data/types';
import { formatCurrency, formatNumber } from '~/utils/calculator';
import styles from './product-card.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const renderDetails = () => {
    switch (product.category) {
      case 'credit':
        return (
          <>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Ставка</span>
              <span className={styles.rate}>от {product.interestRate}%</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Сумма</span>
              <span className={styles.detailValue}>
                {formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Срок</span>
              <span className={styles.detailValue}>до {product.termMonths} мес.</span>
            </div>
          </>
        );

      case 'deposit':
        return (
          <>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Ставка</span>
              <span className={styles.rate}>до {product.interestRate}%</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Сумма</span>
              <span className={styles.detailValue}>
                {product.minAmount === 0 ? 'Без мин.' : formatCurrency(product.minAmount)} - {formatCurrency(product.maxAmount)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Срок</span>
              <span className={styles.detailValue}>до {product.termMonths} мес.</span>
            </div>
          </>
        );

      case 'credit-card':
        return (
          <>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Ставка</span>
              <span className={styles.rate}>от {product.interestRate}%</span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Лимит</span>
              <span className={styles.detailValue}>
                до {formatCurrency(product.maxAmount)}
              </span>
            </div>
            <div className={styles.detail}>
              <span className={styles.detailLabel}>Льготный период</span>
              <span className={styles.detailValue}>до {product.gracePeriodDays} дней</span>
            </div>
          </>
        );

      case 'debit-card':
        return (
          <p className={styles.promoDescription}>
            {product.benefits.length > 150
              ? product.benefits.substring(0, 150) + '...'
              : product.benefits}
          </p>
        );

      case 'promo':
        return (
          <>
            <p className={styles.promoDescription}>{product.description}</p>
            {product.validUntil && (
              <div className={styles.promoValidUntil}>
                <span>⏰</span>
                <span>Действует до: {new Date(product.validUntil).toLocaleDateString('ru-RU')}</span>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className={`${styles.card} ${product.category === 'promo' ? styles.promoCard : ''}`}
    >
      <div className={styles.imageWrapper}>
        <img
          src={product.imageUrl}
          alt={product.productName}
          className={styles.image}
          loading="lazy"
        />
        {product.isFeatured && (
          <div className={styles.featuredBadge}>⭐ Топ</div>
        )}
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.bankName}>{product.bankName}</div>
          <h3 className={styles.productName}>{product.productName}</h3>
        </div>

        <div className={styles.details}>{renderDetails()}</div>
      </div>

      <div className={styles.footer}>
        <button className={styles.button} type="button">
          Подробнее →
        </button>
      </div>
    </Link>
  );
}
