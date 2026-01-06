/**
 * Хук для работы с продуктами
 * Управляет состоянием продуктов и операциями CRUD через Supabase
 */

import { useState, useEffect } from 'react';
import type { Product, ProductCategory } from '~/data/types';
import { initialProducts } from '~/data/initial-products';
import { supabase, isSupabaseEnabled } from '~/utils/supabase';

const LOCAL_STORAGE_KEY = 'fincatalog_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Загрузка продуктов при монтировании
  useEffect(() => {
    loadProducts();
  }, []);

  // Сохранение в localStorage при изменении продуктов (если Supabase не доступен)
  useEffect(() => {
    if (!isSupabaseEnabled && products.length > 0) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        console.error('Ошибка сохранения в localStorage:', e);
      }
    }
  }, [products]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);

      // Если Supabase не настроен, используем localStorage
      if (!isSupabaseEnabled) {
        try {
          const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (stored) {
            setProducts(JSON.parse(stored));
          } else {
            setProducts(initialProducts);
          }
        } catch (e) {
          console.error('Ошибка загрузки из localStorage:', e);
          setProducts(initialProducts);
        }
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase!
        .from('products')
        .select('*')
        .order('createdAt', { ascending: false });

      if (error) throw error;

      if (!data || data.length === 0) {
        // Если данных нет, инициализируем начальными данными
        await initializeProducts();
      } else {
        setProducts(data as Product[]);
      }
    } catch (error) {
      console.error('Ошибка загрузки продуктов:', error);
      setProducts(initialProducts);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeProducts = async () => {
    try {
      if (!isSupabaseEnabled) {
        setProducts(initialProducts);
        return;
      }

      const { data, error } = await supabase!
        .from('products')
        .insert(initialProducts as any[])
        .select();

      if (error) throw error;
      if (data) setProducts(data as Product[]);
    } catch (error) {
      console.error('Ошибка инициализации продуктов:', error);
      setProducts(initialProducts);
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
  const addProduct = async (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newProduct = {
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // Если Supabase не настроен, работаем локально
      if (!isSupabaseEnabled) {
        const localProduct = {
          ...newProduct,
          id: Date.now().toString(),
        } as Product;
        setProducts(prev => [localProduct, ...prev]);
        return localProduct;
      }

      const { data, error } = await supabase!
        .from('products')
        .insert([newProduct as any])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProducts(prev => [data as Product, ...prev]);
        return data as Product;
      }
    } catch (error) {
      console.error('Ошибка добавления продукта:', error);
      throw error;
    }
  };

  // Обновить продукт
  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      // Если Supabase не настроен, работаем локально
      if (!isSupabaseEnabled) {
        setProducts(prev => prev.map(p =>
          p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } as Product : p
        ));
        return;
      }

      const { data, error } = await supabase!
        .from('products')
        .update({ ...updates as any, updatedAt: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setProducts(prev => prev.map(p => (p.id === id ? data as Product : p)));
      }
    } catch (error) {
      console.error('Ошибка обновления продукта:', error);
      throw error;
    }
  };

  // Удалить продукт
  const deleteProduct = async (id: string) => {
    try {
      // Если Supabase не настроен, работаем локально
      if (!isSupabaseEnabled) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
        return;
      }

      const { error } = await supabase!.from('products').delete().eq('id', id);

      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error('Ошибка удаления продукта:', error);
      throw error;
    }
  };

  // Переключить статус "в топе"
  const toggleFeatured = async (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      await updateProduct(id, { isFeatured: !product.isFeatured });
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
