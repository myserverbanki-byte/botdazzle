/**
 * Компонент калькулятора для кредитов и вкладов
 */

import { useState, useEffect } from 'react';
import {
  calculateCreditPayment,
  calculateDepositIncome,
  formatCurrency,
  formatNumber,
} from '~/utils/calculator';
import type { CreditProduct, CreditCardProduct, DepositProduct } from '~/data/types';
import styles from './calculator.module.css';

interface CalculatorProps {
  product: CreditProduct | CreditCardProduct | DepositProduct;
}

export function Calculator({ product }: CalculatorProps) {
  const isCredit = product.category === 'credit' || product.category === 'credit-card';
  const isDeposit = product.category === 'deposit';

  const [amount, setAmount] = useState(
    Math.round((product.minAmount + product.maxAmount) / 2)
  );
  const [term, setTerm] = useState(
    product.category === 'credit-card' ? 12 : product.termMonths
  );

  const result = isCredit
    ? calculateCreditPayment(amount, product.interestRate, term)
    : calculateDepositIncome(amount, product.interestRate, term);

  return (
    <div className={styles.calculator}>
      <h3 className={styles.title}>
        {isCredit ? '💳 Калькулятор платежей' : '💰 Калькулятор дохода'}
      </h3>

      <div className={styles.form}>
        {/* Сумма */}
        <div className={styles.field}>
          <label className={styles.label}>
            {isCredit ? 'Сумма кредита' : 'Сумма вклада'}
          </label>
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              min={product.minAmount}
              max={product.maxAmount}
              step={product.maxAmount > 1000000 ? 100000 : 10000}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeValue}>{formatCurrency(amount)}</div>
          </div>
        </div>

        {/* Срок */}
        <div className={styles.field}>
          <label className={styles.label}>
            {isCredit ? 'Срок кредита (месяцев)' : 'Срок вклада (месяцев)'}
          </label>
          <div className={styles.rangeWrapper}>
            <input
              type="range"
              min={product.category === 'credit-card' ? 3 : 3}
              max={
                product.category === 'credit-card'
                  ? 60
                  : 'termMonths' in product
                  ? product.termMonths
                  : 36
              }
              step={1}
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className={styles.rangeInput}
            />
            <div className={styles.rangeValue}>{term} мес.</div>
          </div>
        </div>
      </div>

      {/* Результаты */}
      <div className={styles.results}>
        {isCredit ? (
          <>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Ежемесячный платеж:</span>
              <span className={`${styles.resultValue} ${styles.resultValueLarge}`}>
                {formatCurrency(result.monthlyPayment || 0)}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Общая сумма выплат:</span>
              <span className={styles.resultValue}>
                {formatCurrency(result.totalPayment || 0)}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Переплата:</span>
              <span className={styles.resultValue}>
                {formatCurrency(result.overpayment || 0)}
              </span>
            </div>
          </>
        ) : (
          <>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Ежемесячный доход:</span>
              <span className={`${styles.resultValue} ${styles.resultValueLarge}`}>
                {formatCurrency(result.monthlyIncome || 0)}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Общий доход:</span>
              <span className={styles.resultValue}>
                {formatCurrency(result.totalIncome || 0)}
              </span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Итоговая сумма:</span>
              <span className={styles.resultValue}>
                {formatCurrency(amount + (result.totalIncome || 0))}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
