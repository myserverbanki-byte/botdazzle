/**
 * Страница отладки для проверки переменных окружения
 */

export default function Debug() {
    const env = {
        VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
        VITE_SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY,
        SUPABASE_URL: import.meta.env.SUPABASE_URL,
        SUPABASE_ANON_KEY: import.meta.env.SUPABASE_ANON_KEY,
    };

    return (
        <div style={{ padding: '2rem', fontFamily: 'monospace' }}>
            <h1>Отладка переменных окружения</h1>
            <pre style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '4px' }}>
                {JSON.stringify(
                    {
                        ...env,
                        // Маскируем ключи для безопасности
                        VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY
                            ? env.VITE_SUPABASE_ANON_KEY.substring(0, 20) + '...'
                            : undefined,
                        SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY
                            ? env.SUPABASE_ANON_KEY.substring(0, 20) + '...'
                            : undefined,
                    },
                    null,
                    2
                )}
            </pre>
            <p>
                <strong>Статус:</strong>{' '}
                {env.VITE_SUPABASE_URL && env.VITE_SUPABASE_ANON_KEY ? (
                    <span style={{ color: 'green' }}>✓ Переменные найдены</span>
                ) : (
                    <span style={{ color: 'red' }}>✗ Переменные не найдены</span>
                )}
            </p>
        </div>
    );
}
