import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { CatalogueProvider } from './context/CatalogueContext';
import { ModalProvider } from './context/ModalContext';
import { ContactPrefillProvider } from './context/ContactPrefillContext';
import App from './App';

export function render(url) {
  const helmetContext = {};

  const appHtml = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <CatalogueProvider>
          <ContactPrefillProvider>
            <ModalProvider>
              <App />
            </ModalProvider>
          </ContactPrefillProvider>
        </CatalogueProvider>
      </StaticRouter>
    </HelmetProvider>
  );

  return { appHtml, helmet: helmetContext.helmet };
}

