# Быстрый старт: Подключение Supabase на Vercel

## За 5 минут:

### 1. Создайте проект в Supabase (2 мин)

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Дождитесь завершения настройки

### 2. Создайте таблицу (1 мин)

1. В Supabase: **SQL Editor** → **New query**
2. Вставьте и выполните:

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

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read" ON products FOR SELECT USING (true);
CREATE POLICY "public_insert" ON products FOR INSERT WITH CHECK (true);
CREATE POLICY "public_update" ON products FOR UPDATE USING (true);
CREATE POLICY "public_delete" ON products FOR DELETE USING (true);
```

### 3. Скопируйте ключи (30 сек)

В Supabase: **Settings → API**

Скопируйте:
- Project URL (например: `https://xxxxx.supabase.co`)
- anon public key (начинается с `eyJ...`)

### 4. Добавьте в Vercel (1 мин)

В Vercel: **Settings → Environment Variables**

Добавьте две переменные:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` |

⚠️ Выберите все окружения: **Production + Preview + Development**

### 5. Redeploy (30 сек)

**Deployments** → последний деплой → **...** → **Redeploy**

✅ Отметьте **"Clear cache and rebuild"**

### 6. Проверка (30 сек)

После завершения деплоя откройте:

`https://ваш-домен.vercel.app/debug`

Должно быть:
```
✓ Переменные найдены
VITE_SUPABASE_URL: "https://xxxxx.supabase..."
VITE_SUPABASE_ANON_KEY: "eyJ..."
```

---

## Готово!

Теперь зайдите в админку:
- `/admin/login`
- Логин: `admin`
- Пароль: `admin123`

Попробуйте добавить продукт - данные сохранятся в Supabase!

---

## Если что-то не работает

Откройте [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) для подробной инструкции по устранению проблем.
