# Деплой на Vercel

Ваше приложение готово к деплою на Vercel!

## Шаги для деплоя:

### 1. Подготовка репозитория

Убедитесь, что ваш код загружен в Git-репозиторий (GitHub, GitLab или Bitbucket):

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repository-url>
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

- ✅ `vercel.json` - конфигурация для Vercel с правильной маршрутизацией
- ✅ `api/index.js` - serverless function для SSR с обработкой ошибок
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

### FUNCTION_INVOCATION_FAILED (500 ошибка)

Если вы видите ошибку "This Serverless Function has crashed":

1. **Проверьте Runtime Logs** в Vercel Dashboard:
   - Перейдите в проект → Functions
   - Посмотрите детальные логи ошибок

2. **Убедитесь в правильности зависимостей**:
   - Все необходимые пакеты должны быть в `dependencies` (не в `devDependencies`)
   - Особенно важно для `@react-router/node` и `@react-router/serve`

3. **Проверьте сборку**:
   - Посмотрите Build Logs в Vercel
   - Убедитесь, что папка `build/server` создана
   - Проверьте, что файл `build/server/index.js` существует

4. **Очистите кеш**:
   - В Vercel Dashboard: Deployments → ... → Redeploy → Clear cache

### Другие проблемы

1. **Ошибка при сборке**:
   - Проверьте логи сборки в Vercel Dashboard
   - Убедитесь, что все зависимости установлены
   - Проверьте, что Node.js версия совместима (рекомендуется 18.x или выше)
   - Запустите `npm run build` локально для проверки

2. **404 на страницах**:
   - Убедитесь, что `vercel.json` настроен правильно
   - Проверьте маршрутизацию в `app/routes.ts`
   - Проверьте, что статические файлы попадают в `build/client`

3. **Медленная загрузка**:
   - Проверьте регион деплоя (Settings → General)
   - Оптимизируйте размер бандла
   - Используйте lazy loading для компонентов

## Локальная проверка

Перед деплоем можно проверить production build локально:

```bash
# Сборка
npm run build

# Запуск production сервера
npm start
```

Откройте `http://localhost:3000` для проверки.

## Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [React Router v7 Documentation](https://reactrouter.com/)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
