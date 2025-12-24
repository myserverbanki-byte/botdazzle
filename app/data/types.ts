/**
 * Типы финансовых продуктов
 */

// Базовые типы категорий
export type ProductCategory = 'credit' | 'deposit' | 'debit-card' | 'credit-card' | 'promo';

export interface BaseProduct {
  id: string;
  category: ProductCategory;
  bankName: string;
  productName: string;
  imageUrl: string;
  applicationUrl: string;
  isFeatured: boolean; // Для раздела "Топ"
  createdAt: string;
  updatedAt: string;
}

// Кредит наличными
export interface CreditProduct extends BaseProduct {
  category: 'credit';
  interestRate: number; // Процентная ставка (%)
  minAmount: number; // Минимальная сумма
  maxAmount: number; // Максимальная сумма
  termMonths: number; // Срок кредита (месяцы)
  conditions: string; // Условия
}

// Вклад
export interface DepositProduct extends BaseProduct {
  category: 'deposit';
  interestRate: number; // Процентная ставка (%)
  minAmount: number; // Минимальная сумма
  maxAmount: number; // Максимальная сумма
  termMonths: number; // Срок вклада (месяцы)
  conditions: string; // Условия
}

// Дебетовая карта
export interface DebitCardProduct extends BaseProduct {
  category: 'debit-card';
  benefits: string; // Бонусы и преимущества
  conditions: string; // Условия
}

// Кредитная карта
export interface CreditCardProduct extends BaseProduct {
  category: 'credit-card';
  interestRate: number; // Процентная ставка (%)
  minAmount: number; // Минимальный кредитный лимит
  maxAmount: number; // Максимальный кредитный лимит
  gracePeriodDays: number; // Льготный период (дни)
  conditions: string; // Условия
}

// Акция банка
export interface PromoProduct extends BaseProduct {
  category: 'promo';
  description: string; // Описание акции
  validUntil?: string; // Срок действия акции
}

// Объединенный тип продукта
export type Product = 
  | CreditProduct 
  | DepositProduct 
  | DebitCardProduct 
  | CreditCardProduct 
  | PromoProduct;

// Вспомогательные типы для фильтрации
export type FilterType = 'all' | ProductCategory;

// Типы для калькулятора
export interface CalculatorResult {
  monthlyPayment?: number; // Ежемесячный платеж (для кредитов)
  totalPayment?: number; // Общая сумма выплат (для кредитов)
  overpayment?: number; // Переплата (для кредитов)
  monthlyIncome?: number; // Ежемесячный доход (для вкладов)
  totalIncome?: number; // Общий доход (для вкладов)
}
