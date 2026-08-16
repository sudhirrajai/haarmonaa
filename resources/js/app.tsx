import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from '@/context/CartContext';

const appName = import.meta.env.VITE_APP_NAME || 'Haarmonaa';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    setup({ el, App, props }) {
        if (el) {
            createRoot(el).render(
                <CartProvider>
                    <App {...props} />
                </CartProvider>
            );
        }
    },
    progress: {
        color: '#d0473e',
    },
});
