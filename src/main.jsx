import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import '@fontsource/sora/400.css';
import '@fontsource/sora/600.css';
import '@fontsource/sora/700.css';
import '@fontsource/sora/800.css';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/500.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';

import './styles/tokens.css';
import { CatalogueProvider } from './context/CatalogueContext';
import { ModalProvider } from './context/ModalContext';
import { ContactPrefillProvider } from './context/ContactPrefillContext';
import App from './App';

if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <CatalogueProvider>
          <ContactPrefillProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </ContactPrefillProvider>
        </CatalogueProvider>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

