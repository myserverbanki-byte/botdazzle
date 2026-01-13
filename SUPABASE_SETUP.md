# Настройка Supabase

## Диагностика проблемы

1. **Откройте страницу отладки** после деплоя: `https://ваш-домен.vercel.app/debug`

   Эта страница покажет, какие переменные окружения доступны в приложении.

2. **Проверьте консоль браузера** (F12 → Console)

   Вы должны увидеть сообщения:
   ```
   [Supabase] Инициализация: { hasUrl: true/false, hasKey: true/false, url: '...' }
   [Supabase] Статус: Включен/Отключен
   ```

## Настройка переменных в Vercel

### Шаг 1: Получите данные из Supabase

1. Откройте [Supabase Dashboard](https://supabase.com/dashboard)
2. Выберите ваш проект (или создайте новый)
3. Перейдите в **Settings → API**
4. Найдите:
   - **Project URL** (например: `https://xxxxx.supabase.co`)
   - **anon/public key** (начинается с `eyJ...`)

### Шаг 2: Создайте таблицу в Supabase

1. В Supabase Dashboard перейдите в **Table Editor**
2. Нажмите **New table**
3. Создайте таблицу `products` со следующими колонками:

```sql
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  features TEXT[] NOT NULL DEFAULT '{}',
  benefits TEXT[] NOT NULL DEFAULT '{}',
  "isFeatured" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Включаем Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Создаем политику для чтения (публичный доступ)
CREATE POLICY "Все могут читать продукты"
  ON products FOR SELECT
  USING (true);

-- Создаем политику для вставки (публичный доступ - временно для разработки)
CREATE POLICY "Все могут добавлять продукты"
  ON products FOR INSERT
  WITH CHECK (true);

-- Создаем политику для обновления (публичный доступ - временно для разработки)
CREATE POLICY "Все могут обновлять продукты"
  ON products FOR UPDATE
  USING (true);

-- Создаем политику для удаления (публичный доступ - временно для разработки)
CREATE POLICY "Все могут удалять продукты"
  ON products FOR DELETE
  USING (true);
```

**⚠️ ВАЖНО:** Политики выше дают полный публичный доступ для разработки. В production используйте более строгие правила с аутентификацией.

### Шаг 3: Добавьте переменные в Vercel

1. Откройте ваш проект на [Vercel Dashboard](https://vercel.com/dashboard)
2. Перейдите в **Settings → Environment Variables**
3. Добавьте **две** переменные:

   **Переменная 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://xxxxx.supabase.co` (ваш Project URL)
   - Environment: Production, Preview, Development (выберите все)

   **Переменная 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJ...` (ваш anon/public key)
   - Environment: Production, Preview, Development (выберите все)

4. Нажмите **Save**

### Шаг 4: Redeploy приложения

После добавления переменных нужно пересобрать приложение:

1. Перейдите в **Deployments**
2. Найдите последний деплой
3. Нажмите на три точки (...) справа
4. Выберите **Redeploy**
5. ⚠️ **ОБЯЗАТЕЛЬНО отметьте "Clear cache and rebuild"**
6. Нажмите **Redeploy**

### Шаг 5: Проверка

После завершения деплоя:

1. Откройте `https://ваш-домен.vercel.app/debug`
2. Должны увидеть:
   ```json
   {
     "VITE_SUPABASE_URL": "https://xxxxx.supabase.co",
     "VITE_SUPABASE_ANON_KEY": "eyJ...",
     "SUPABASE_URL": undefined,
     "SUPABASE_ANON_KEY": undefined
   }
   
   Статус: ✓ Переменные найдены
   ```

3. В консоли браузера должно быть:
   ```
   [Supabase] Инициализация: { hasUrl: true, hasKey: true, url: 'https://xxxxx.supabase...' }
   [Supabase] Статус: Включен
   ```

4. Перейдите в админку `/admin/login`
5. Войдите (логин: `admin`, пароль: `admin123`)
6. Попробуйте добавить продукт

## Почему VITE_ префикс?

React Router v7 использует Vite для сборки. Vite встраивает в клиентский код только переменные окружения с префиксом `VITE_`. Это сделано для безопасности, чтобы случайно не встроить серверные секреты в клиентский код.

## Локальная разработка

Для локальной разработки создайте файл `.env` в корне проекта:

```env
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

Этот файл уже добавлен в `.gitignore` и не попадет в репозиторий.

## Альтернатива: Работа без Supabase

Если вы не хотите использовать Supabase, приложение автоматически переключится на localStorage:

1. Не добавляйте переменные окружения
2. Приложение будет использовать локальное хранилище браузера
3. Данные будут сохраняться только в текущем браузере
4. При очистке кэша браузера данные удалятся

## Устранение проблем

### Переменные не видны в /debug

**Причина:** Vercel не пересобрал приложение с новыми переменными

**Решение:**
1. Settings → Environment Variables - проверьте, что переменные добавлены
2. Deployments → последний деплой → ... → Redeploy → **Clear cache and rebuild**

### Ошибка "Invalid API key" в консоли

**Причина:** Неправильный ключ API

**Решение:**
1. Проверьте, что скопировали **anon/public key**, а не service_role key
2. Ключ должен начинаться с `eyJ`
3. Пересохраните переменную в Vercel
4. Redeploy с очисткой кэша

### Ошибка "Could not connect to database"

**Причина:** Неправильный URL или проблемы с сетью

**Решение:**
1. Проверьте URL в Supabase Dashboard
2. URL должен быть вида `https://xxxxx.supabase.co`
3. Убедитесь, что проект Supabase активен
4. Пересохраните переменную в Vercel
5. Redeploy с очисткой кэша

### Ошибки с правами доступа

**Причина:** Row Level Security блокирует доступ

**Решение:**
1. Откройте Supabase Dashboard → SQL Editor
2. Выполните SQL команды из "Шаг 2" выше
3. Проверьте в Table Editor → products → Configuration что RLS policies созданы
