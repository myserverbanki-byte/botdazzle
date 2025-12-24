/**
 * Утилиты для финансовых расчетов
 */

import type { CalculatorResult } from '~/data/types';

/**
 * Расчет ежемесячного платежа по кредиту (аннуитетный платеж)
 * @param amount - Сумма кредита
 * @param rate - Годовая процентная ставка (%)
 * @param months - Срок кредита в месяцах
 */
export function calculateCreditPayment(
  amount: number,
  rate: number,
  months: number
): CalculatorResult {
  if (amount <= 0 || rate < 0 || months <= 0) {
    return {
      monthlyPayment: 0,
      totalPayment: 0,
      overpayment: 0,
    };
  }

  // Месячная процентная ставка
  const monthlyRate = rate / 100 / 12;

  // Формула аннуитетного платежа
  const monthlyPayment =
    monthlyRate === 0
      ? amount / months
      : (amount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);

  const totalPayment = monthlyPayment * months;
  const overpayment = totalPayment - amount;

  return {
    monthlyPayment: Math.round(monthlyPayment * 100) / 100,
    totalPayment: Math.round(totalPayment * 100) / 100,
    overpayment: Math.round(overpayment * 100) / 100,
  };
}

/**
 * Расчет дохода по вкладу (простые проценты, ежемесячная капитализация)
 * @param amount - Сумма вклада
 * @param rate - Годовая процентная ставка (%)
 * @param months - Срок вклада в месяцах
 */
export function calculateDepositIncome(
  amount: number,
  rate: number,
  months: number
): CalculatorResult {
  if (amount <= 0 || rate < 0 || months <= 0) {
    return {
      monthlyIncome: 0,
      totalIncome: 0,
    };
  }

  // Месячная процентная ставка
  const monthlyRate = rate / 100 / 12;

  // Ежемесячный доход (с учетом капитализации)
  let currentAmount = amount;
  let totalIncome = 0;

  for (let i = 0; i < months; i++) {
    const monthIncome = currentAmount * monthlyRate;
    totalIncome += monthIncome;
    currentAmount += monthIncome;
  }

  const monthlyIncome = totalIncome / months;

  return {
    monthlyIncome: Math.round(monthlyIncome * 100) / 100,
    totalIncome: Math.round(totalIncome * 100) / 100,
  };
}

/**
 * Форматирование суммы в рубли
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Форматирование числа с разделителями
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat('ru-RU').format(num);
}
