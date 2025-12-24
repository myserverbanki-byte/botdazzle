/**
 * Хук для работы с продуктами
 * Управляет состоянием продуктов и операциями CRUD
 */

import { useState, useEffect } from 'react';
import type { Product, ProductCategory } from '~/data/types';
import { initialProducts } from '~/data/initial-products';

const STORAGE_KEY = 'financial-products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка продуктов из localStorage при монтировании
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        // Если данных нет, используем начальные данные
        setProducts(initialProducts);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialProducts));
      }
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Сохранение продуктов в localStorage
  const saveProducts = (newProducts: Product[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (error) {
      console.error('Ошибка сохранения продуктов:', error);
    }
  };

  // Получить все продукты
  const getAllProducts = () => products;

  // Получить продукты по категории
  const getProductsByCategory = (category: ProductCategory) => {
    return products.filter(p => p.category === category);
  };

  // Получить топовые продукты
  const getFeaturedProducts = () => {
    return products.filter(p => p.isFeatured);
  };

  // Получить продукт по ID
  const getProductById = (id: string) => {
    return products.find(p => p.id === id);
  };

  // Добавить продукт
  const addProduct = (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as Product;

    const newProducts = [...products, newProduct];
    saveProducts(newProducts);
    return newProduct;
  };

  // Обновить продукт
  const updateProduct = (id: string, updates: Partial<Product>) => {
    const newProducts = products.map(p =>
      p.id === id
        ? ({ ...p, ...updates, updatedAt: new Date().toISOString() } as Product)
        : p
    );
    saveProducts(newProducts);
  };

  // Удалить продукт
  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
  };

  // Переключить статус "в топе"
  const toggleFeatured = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      updateProduct(id, { isFeatured: !product.isFeatured });
    }
  };

  return {
    products,
    isLoading,
    getAllProducts,
    getProductsByCategory,
    getFeaturedProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
  };
}
