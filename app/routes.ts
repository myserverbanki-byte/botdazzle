import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  // Публичные маршруты
  index('./routes/home.tsx'),
  route('product/:id', './routes/product.$id.tsx'),

  // Админ-панель
  route('admin/login', './routes/admin.login.tsx'),
  route('admin/dashboard', './routes/admin.dashboard.tsx'),
  route('admin/product/:id?/:mode?', './routes/admin.product.$action.tsx'),
] satisfies RouteConfig;
