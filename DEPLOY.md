# Деплой на Vercel

Ваше приложение готово к деплою на Vercel!

## Шаги для деплоя:

### 1. Подготовка репозитория

Убедитесь, что ваш код загружен в Git-репозиторий (GitHub, GitLab или Bitbucket):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/myserverbanki-byte/botdazzle.git
git push -u origin main
```

### 2. Деплой через Vercel Dashboard

1. Перейдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Импортируйте ваш Git-репозиторий
4. Vercel автоматически определит настройки из `vercel.json`
5. Нажмите "Deploy"

### 3. Деплой через Vercel CLI

Альтернативный способ - использовать CLI:

```bash
# Установите Vercel CLI
npm i -g vercel

# Запустите деплой
vercel

# Или сразу на продакшен
vercel --prod
```

## Настройки проекта

В вашем проекте уже настроено:

- ✅ `vercel.json` - конфигурация для Vercel
- ✅ `api/index.js` - serverless function для SSR
- ✅ Build команды в `package.json`

## Переменные окружения

Если у вас есть секретные переменные (API ключи и т.д.), добавьте их в настройках проекта на Vercel:

1. Откройте проект на Vercel
2. Перейдите в Settings → Environment Variables
3. Добавьте необходимые переменные

## После деплоя

После успешного деплоя вы получите:

- Production URL (например, `your-app.vercel.app`)
- Автоматические деплои при каждом push в main ветку
- Preview деплои для pull requests

## Проблемы?

Если что-то не работает:

1. Проверьте логи сборки в Vercel Dashboard
2. Убедитесь, что все зависимости установлены
3. Проверьте, что Node.js версия совместима (рекомендуется 18.x или выше)

## Локальная проверка

Перед деплоем можно проверить production build локально:

```bash
# Сборка
npm run build

# Запуск production сервера
npm start
```

Откройте `http://localhost:3000` для проверки.
