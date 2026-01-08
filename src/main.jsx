import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { store } from './app/store.js'
import { Provider } from 'react-redux'
import { loadUserFromStorage } from './features/authSlice'
import { loadTheme } from './features/themeSlice'
import ErrorBoundary from './components/ErrorBoundary'

console.log('🚀 Starting application...');

// Error handler for unhandled errors
window.addEventListener('error', (event) => {
    console.error('❌ Unhandled error:', event.error);
    console.error('Error details:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
    });
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Unhandled promise rejection:', event.reason);
});

// Load user and theme from localStorage on app initialization
try {
    console.log('📦 Loading user from storage...');
    store.dispatch(loadUserFromStorage());
    console.log('✅ User loaded from storage');
    
    console.log('📦 Loading theme from storage...');
    store.dispatch(loadTheme());
    console.log('✅ Theme loaded from storage');
} catch (error) {
    console.error('❌ Error loading from storage:', error);
}

const rootElement = document.getElementById('root');

if (!rootElement) {
    console.error('❌ Root element not found!');
    throw new Error('Root element not found');
}

console.log('🎨 Rendering application...');

try {
    createRoot(rootElement).render(
        <ErrorBoundary>
            <BrowserRouter>
                <Provider store={store}>
                    <App />
                </Provider>
            </BrowserRouter>
        </ErrorBoundary>
    );
    console.log('✅ Application rendered successfully');
} catch (error) {
    console.error('❌ Error rendering application:', error);
    rootElement.innerHTML = `
        <div style="padding: 20px; font-family: sans-serif;">
            <h1 style="color: red;">Erro ao renderizar aplicação</h1>
            <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px;">${error.toString()}</pre>
            <button onclick="window.location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
                Recarregar
            </button>
        </div>
    `;
}