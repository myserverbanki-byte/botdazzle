/**
 * Утилиты для работы с Telegram Mini App API
 * Документация: https://core.telegram.org/bots/webapps
 */

// Типы для Telegram WebApp
interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    auth_date: number;
    hash: string;
  };
  colorScheme: 'light' | 'dark';
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
    show(): void;
    hide(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    isProgressVisible: boolean;
    setText(text: string): void;
    show(): void;
    hide(): void;
    enable(): void;
    disable(): void;
    showProgress(leaveActive?: boolean): void;
    hideProgress(): void;
    onClick(callback: () => void): void;
    offClick(callback: () => void): void;
  };
  HapticFeedback: {
    impactOccurred(style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'): void;
    notificationOccurred(type: 'error' | 'success' | 'warning'): void;
    selectionChanged(): void;
  };
  ready(): void;
  expand(): void;
  close(): void;
  openLink(url: string, options?: { try_instant_view?: boolean }): void;
  openTelegramLink(url: string): void;
  showPopup(params: {
    title?: string;
    message: string;
    buttons?: Array<{
      id?: string;
      type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
      text?: string;
    }>;
  }): void;
  showAlert(message: string): void;
  showConfirm(message: string): Promise<boolean>;
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

/**
 * Получить экземпляр Telegram WebApp
 */
export function getTelegramWebApp(): TelegramWebApp | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp || null;
}

/**
 * Проверка, запущено ли приложение внутри Telegram
 */
export function isTelegramWebApp(): boolean {
  return getTelegramWebApp() !== null;
}

/**
 * Инициализация Telegram WebApp
 */
export function initTelegramWebApp(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.ready();
    tg.expand();
  }
}

/**
 * Получить данные пользователя Telegram
 */
export function getTelegramUser() {
  const tg = getTelegramWebApp();
  return tg?.initDataUnsafe?.user || null;
}

/**
 * Получить цветовую схему Telegram
 */
export function getTelegramColorScheme(): 'light' | 'dark' | null {
  const tg = getTelegramWebApp();
  return tg?.colorScheme || null;
}

/**
 * Показать кнопку "Назад" в Telegram
 */
export function showBackButton(onClick: () => void): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.onClick(onClick);
    tg.BackButton.show();
  }
}

/**
 * Скрыть кнопку "Назад"
 */
export function hideBackButton(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.BackButton.hide();
  }
}

/**
 * Показать главную кнопку в Telegram
 */
export function showMainButton(text: string, onClick: () => void): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.setText(text);
    tg.MainButton.onClick(onClick);
    tg.MainButton.show();
  }
}

/**
 * Скрыть главную кнопку
 */
export function hideMainButton(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.MainButton.hide();
  }
}

/**
 * Тактильная обратная связь
 */
export function hapticFeedback(
  type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection'
): void {
  const tg = getTelegramWebApp();
  if (tg) {
    if (type === 'success' || type === 'warning' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type);
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    } else {
      tg.HapticFeedback.impactOccurred(type);
    }
  }
}

/**
 * Открыть внешнюю ссылку
 */
export function openLink(url: string, tryInstantView = false): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.openLink(url, { try_instant_view: tryInstantView });
  } else {
    window.open(url, '_blank');
  }
}

/**
 * Показать уведомление
 */
export function showAlert(message: string): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.showAlert(message);
  } else {
    alert(message);
  }
}

/**
 * Показать диалог подтверждения
 */
export async function showConfirm(message: string): Promise<boolean> {
  const tg = getTelegramWebApp();
  if (tg) {
    return await tg.showConfirm(message);
  } else {
    return confirm(message);
  }
}

/**
 * Закрыть Mini App
 */
export function closeTelegramWebApp(): void {
  const tg = getTelegramWebApp();
  if (tg) {
    tg.close();
  }
}
