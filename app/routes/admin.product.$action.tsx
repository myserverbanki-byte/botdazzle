/**
 * Форма создания/редактирования продукта
 */

import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import type { Route } from './+types/admin.product.$action';
import { useAuth } from '~/hooks/use-auth';
import { useProducts } from '~/hooks/use-products';
import type { Product, ProductCategory } from '~/data/types';
import styles from './admin.product.$action.module.css';

export function meta({}: Route.MetaArgs) {
  // Meta определяется динамически внутри компонента
  return [
    {
      title: 'Управление продуктом - FinCatalog Admin',
    },
  ];
}

export default function AdminProductForm() {
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { getProductById, addProduct, updateProduct } = useProducts();

  // Определяем режим: если mode === 'edit', то это редактирование
  const isEdit = params.mode === 'edit';
  // ID продукта (при редактировании)
  const productId = isEdit ? params.id : null;

  // Проверка аутентификации
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Состояние формы
  const [category, setCategory] = useState<ProductCategory>('credit');
  const [bankName, setBankName] = useState('');
  const [productName, setProductName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [applicationUrl, setApplicationUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);

  // Поля для кредита и кредитной карты
  const [interestRate, setInterestRate] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [termMonths, setTermMonths] = useState('');
  const [gracePeriodDays, setGracePeriodDays] = useState('');
  const [conditions, setConditions] = useState('');

  // Поля для дебетовой карты
  const [benefits, setBenefits] = useState('');

  // Поля для акции
  const [description, setDescription] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const [error, setError] = useState('');

  // Загрузка данных при редактировании
  useEffect(() => {
    if (isEdit && productId) {
      const product = getProductById(productId);
      if (product) {
        setCategory(product.category);
        setBankName(product.bankName);
        setProductName(product.productName);
        setImageUrl(product.imageUrl);
        setApplicationUrl(product.applicationUrl);
        setIsFeatured(product.isFeatured);

        if ('interestRate' in product) setInterestRate(String(product.interestRate));
        if ('minAmount' in product) setMinAmount(String(product.minAmount));
        if ('maxAmount' in product) setMaxAmount(String(product.maxAmount));
        if ('termMonths' in product) setTermMonths(String(product.termMonths));
        if ('gracePeriodDays' in product)
          setGracePeriodDays(String(product.gracePeriodDays));
        if ('conditions' in product) setConditions(product.conditions);
        if ('benefits' in product) setBenefits(product.benefits);
        if ('description' in product) setDescription(product.description);
        if ('validUntil' in product && product.validUntil)
          setValidUntil(product.validUntil.split('T')[0]);
      }
    }
  }, [isEdit, productId, getProductById]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!bankName || !productName || !imageUrl || !applicationUrl) {
      setError('Заполните все обязательные поля');
      return;
    }

    // Формирование данных продукта
    const baseData = {
      category,
      bankName,
      productName,
      imageUrl,
      applicationUrl,
      isFeatured,
    };

    let productData: any;

    switch (category) {
      case 'credit':
        if (!interestRate || !minAmount || !maxAmount || !termMonths || !conditions) {
          setError('Заполните все поля для кредита');
          return;
        }
        productData = {
          ...baseData,
          category: 'credit',
          interestRate: parseFloat(interestRate),
          minAmount: parseFloat(minAmount),
          maxAmount: parseFloat(maxAmount),
          termMonths: parseInt(termMonths),
          conditions,
        };
        break;

      case 'deposit':
        if (!interestRate || !minAmount || !maxAmount || !termMonths || !conditions) {
          setError('Заполните все поля для вклада');
          return;
        }
        productData = {
          ...baseData,
          category: 'deposit',
          interestRate: parseFloat(interestRate),
          minAmount: parseFloat(minAmount),
          maxAmount: parseFloat(maxAmount),
          termMonths: parseInt(termMonths),
          conditions,
        };
        break;

      case 'credit-card':
        if (
          !interestRate ||
          !minAmount ||
          !maxAmount ||
          !gracePeriodDays ||
          !conditions
        ) {
          setError('Заполните все поля для кредитной карты');
          return;
        }
        productData = {
          ...baseData,
          category: 'credit-card',
          interestRate: parseFloat(interestRate),
          minAmount: parseFloat(minAmount),
          maxAmount: parseFloat(maxAmount),
          gracePeriodDays: parseInt(gracePeriodDays),
          conditions,
        };
        break;

      case 'debit-card':
        if (!benefits || !conditions) {
          setError('Заполните все поля для дебетовой карты');
          return;
        }
        productData = {
          ...baseData,
          category: 'debit-card',
          benefits,
          conditions,
        };
        break;

      case 'promo':
        if (!description) {
          setError('Заполните описание акции');
          return;
        }
        productData = {
          ...baseData,
          category: 'promo',
          description,
          validUntil: validUntil || undefined,
        };
        break;

      default:
        setError('Неизвестная категория');
        return;
    }

    // Сохранение
    if (isEdit && productId) {
      updateProduct(productId, productData as Partial<Product>);
    } else {
      addProduct(productData);
    }

    navigate('/admin/dashboard');
  };

  if (authLoading) {
    return <div className={styles.page}>Загрузка...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.page}>
      {/* Шапка */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/admin/dashboard" className={styles.backButton}>
            <span>←</span>
            <span>Назад к списку</span>
          </Link>
        </div>
      </header>

      {/* Форма */}
      <main className={styles.main}>
        <div className={styles.card}>
          <h1 className={styles.title}>
            {isEdit ? 'Редактирование продукта' : 'Новый продукт'}
          </h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            {error && <div className={styles.error}>{error}</div>}

            {/* Основная информация */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Основная информация</h2>

              <div className={styles.field}>
                <label htmlFor="category" className={styles.label}>
                  Категория <span className={styles.required}>*</span>
                </label>
                <select
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ProductCategory)}
                  className={styles.select}
                  disabled={isEdit}
                >
                  <option value="credit">Кредит наличными</option>
                  <option value="deposit">Вклад</option>
                  <option value="debit-card">Дебетовая карта</option>
                  <option value="credit-card">Кредитная карта</option>
                  <option value="promo">Акция банка</option>
                </select>
                {isEdit && (
                  <p className={styles.help}>
                    Категорию нельзя изменить при редактировании
                  </p>
                )}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="bankName" className={styles.label}>
                    Название банка <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="bankName"
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    placeholder="Например: Сбербанк"
                    className={styles.input}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="productName" className={styles.label}>
                    Название продукта <span className={styles.required}>*</span>
                  </label>
                  <input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Например: Кредит наличными"
                    className={styles.input}
                  />
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="imageUrl" className={styles.label}>
                  URL изображения <span className={styles.required}>*</span>
                </label>
                <input
                  id="imageUrl"
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={styles.input}
                />
                <p className={styles.help}>
                  Рекомендуется использовать изображения с Unsplash или Pexels
                </p>
              </div>

              <div className={styles.field}>
                <label htmlFor="applicationUrl" className={styles.label}>
                  Ссылка для оформления <span className={styles.required}>*</span>
                </label>
                <input
                  id="applicationUrl"
                  type="url"
                  value={applicationUrl}
                  onChange={(e) => setApplicationUrl(e.target.value)}
                  placeholder="https://bank.ru/product"
                  className={styles.input}
                />
              </div>

              <div className={styles.checkbox}>
                <input
                  id="isFeatured"
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className={styles.checkboxInput}
                />
                <label htmlFor="isFeatured" className={styles.checkboxLabel}>
                  ⭐ Показывать в разделе "Топ"
                </label>
              </div>
            </div>

            {/* Поля для кредита */}
            {category === 'credit' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Параметры кредита</h2>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="interestRate" className={styles.label}>
                      Процентная ставка (%) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="9.9"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="termMonths" className={styles.label}>
                      Срок (месяцы) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="termMonths"
                      type="number"
                      value={termMonths}
                      onChange={(e) => setTermMonths(e.target.value)}
                      placeholder="60"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="minAmount" className={styles.label}>
                      Минимальная сумма <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="minAmount"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="50000"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="maxAmount" className={styles.label}>
                      Максимальная сумма <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="maxAmount"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="5000000"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="conditions" className={styles.label}>
                    Условия <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="conditions"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="От 9,9% годовых. Без обеспечения. Решение за 2 минуты..."
                    className={styles.textarea}
                  />
                </div>
              </div>
            )}

            {/* Поля для вклада */}
            {category === 'deposit' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Параметры вклада</h2>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="interestRate" className={styles.label}>
                      Процентная ставка (%) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="15.0"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="termMonths" className={styles.label}>
                      Срок (месяцы) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="termMonths"
                      type="number"
                      value={termMonths}
                      onChange={(e) => setTermMonths(e.target.value)}
                      placeholder="12"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="minAmount" className={styles.label}>
                      Минимальная сумма <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="minAmount"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="0 или 1000"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="maxAmount" className={styles.label}>
                      Максимальная сумма <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="maxAmount"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="10000000"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="conditions" className={styles.label}>
                    Условия <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="conditions"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="До 15% годовых. Пополнение и снятие без ограничений..."
                    className={styles.textarea}
                  />
                </div>
              </div>
            )}

            {/* Поля для кредитной карты */}
            {category === 'credit-card' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Параметры кредитной карты</h2>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="interestRate" className={styles.label}>
                      Процентная ставка (%) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="interestRate"
                      type="number"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(e.target.value)}
                      placeholder="24.9"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="gracePeriodDays" className={styles.label}>
                      Льготный период (дни) <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="gracePeriodDays"
                      type="number"
                      value={gracePeriodDays}
                      onChange={(e) => setGracePeriodDays(e.target.value)}
                      placeholder="55"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.row}>
                  <div className={styles.field}>
                    <label htmlFor="minAmount" className={styles.label}>
                      Мин. кредитный лимит <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="minAmount"
                      type="number"
                      value={minAmount}
                      onChange={(e) => setMinAmount(e.target.value)}
                      placeholder="30000"
                      className={styles.input}
                    />
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="maxAmount" className={styles.label}>
                      Макс. кредитный лимит <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="maxAmount"
                      type="number"
                      value={maxAmount}
                      onChange={(e) => setMaxAmount(e.target.value)}
                      placeholder="700000"
                      className={styles.input}
                    />
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="conditions" className={styles.label}>
                    Условия <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="conditions"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="Льготный период до 55 дней. Кэшбэк до 30%..."
                    className={styles.textarea}
                  />
                </div>
              </div>
            )}

            {/* Поля для дебетовой карты */}
            {category === 'debit-card' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Параметры дебетовой карты</h2>

                <div className={styles.field}>
                  <label htmlFor="benefits" className={styles.label}>
                    Преимущества и бонусы <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="benefits"
                    value={benefits}
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="До 15% кешбэка. Бесплатное обслуживание. До 6% на остаток..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="conditions" className={styles.label}>
                    Условия <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="conditions"
                    value={conditions}
                    onChange={(e) => setConditions(e.target.value)}
                    placeholder="Бесплатный выпуск и доставка. Cashback категории на выбор..."
                    className={styles.textarea}
                  />
                </div>
              </div>
            )}

            {/* Поля для акции */}
            {category === 'promo' && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Информация об акции</h2>

                <div className={styles.field}>
                  <label htmlFor="description" className={styles.label}>
                    Описание акции <span className={styles.required}>*</span>
                  </label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Откройте вклад на сумму от 100 000₽ и получите 1 000₽ на счет..."
                    className={styles.textarea}
                  />
                </div>

                <div className={styles.field}>
                  <label htmlFor="validUntil" className={styles.label}>
                    Срок действия акции
                  </label>
                  <input
                    id="validUntil"
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className={styles.input}
                  />
                  <p className={styles.help}>
                    Оставьте пустым, если срок не ограничен
                  </p>
                </div>
              </div>
            )}

            {/* Действия */}
            <div className={styles.actions}>
              <button type="submit" className={styles.submitButton}>
                {isEdit ? 'Сохранить изменения' : 'Создать продукт'}
              </button>
              <Link to="/admin/dashboard" className={styles.cancelButton}>
                Отмена
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
