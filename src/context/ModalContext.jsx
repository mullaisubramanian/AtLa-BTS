import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { getAtlaAnswer } from '../lib/search';
import { logAsk, track } from '../lib/api';
import { useCatalogue } from './CatalogueContext';

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const { practices, allServices, packages } = useCatalogue();

  const [practiceModal, setPracticeModal] = useState({
    open: false,
    practiceId: null,
    segmentName: null,
  });

  const [askModalOpen, setAskModalOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [askBusy, setAskBusy] = useState(false);
  const askConversationIdRef = useRef(null);

  const [quickEnquiry, setQuickEnquiry] = useState({
    open: false,
    source: 'contact_form',
  });

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const [slashPopup, setSlashPopup] = useState({
    open: false,
    message: '',
  });

  const openPractice = useCallback((practiceId, segmentName = null) => {
    setPracticeModal({ open: true, practiceId, segmentName });
    track('practice_open', { practiceId, segmentName });
  }, []);

  const closePractice = useCallback(() => {
    setPracticeModal((prev) => ({ ...prev, open: false }));
  }, []);

  const openAsk = useCallback(() => {
    setAskModalOpen(true);
  }, []);

  const closeAsk = useCallback(() => {
    setAskModalOpen(false);
  }, []);

  const clearChat = useCallback(() => {
    setMessages([]);
    setAskBusy(false);
    askConversationIdRef.current = null;
  }, []);

  const askAtla = useCallback(
    (question) => {
      const q = (question || '').trim();
      if (!q || askBusy) return;
      setAskBusy(true);
      setAskModalOpen(true);

      const userId = `u-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const botId = `b-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      const answer = getAtlaAnswer(q, { practices, allServices, packages });

      const firstParagraphText = (answer.p?.[0] || [])
        .map((part) => (typeof part === 'string' ? part : part.text))
        .join('');

      track('ask_atla_submit', {
        intent: answer.intent,
        matched_practice_id: answer.matchedPracticeId,
      });

      const pagePath =
        typeof window !== 'undefined' ? window.location.pathname : '/';

      logAsk({
        conversationId: askConversationIdRef.current,
        page: pagePath,
        role: 'user',
        content: q,
        intent: answer.intent,
        practice: answer.matchedPracticeId,
        services: answer.matchedServices || [],
      }).then(({ data: convId }) => {
        if (convId) {
          askConversationIdRef.current = convId;
          logAsk({
            conversationId: convId,
            page: pagePath,
            role: 'assistant',
            content: firstParagraphText,
            intent: answer.intent,
            practice: answer.matchedPracticeId,
            services: answer.matchedServices || [],
          });
        }
      });

      setMessages((prev) => [
        ...prev,
        {
          id: userId,
          role: 'user',
          text: q,
        },
        {
          id: botId,
          role: 'bot',
          question: q,
          answer,
          status: 'thinking',
          getConversationId: () => askConversationIdRef.current,
        },
      ]);
    },
    [askBusy, practices, allServices, packages]
  );

  const logAskClick = useCallback((clickedLabel) => {
    track('ask_result_click', { clicked: clickedLabel });
    const pagePath =
      typeof window !== 'undefined' ? window.location.pathname : '/';
    if (askConversationIdRef.current) {
      logAsk({
        conversationId: askConversationIdRef.current,
        page: pagePath,
        role: 'assistant',
        content: `Clicked: ${clickedLabel}`,
        clicked: clickedLabel,
      });
    }
  }, []);

  const finishBotMessage = useCallback((botId) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === botId ? { ...m, status: 'done' } : m))
    );
    setAskBusy(false);
  }, []);

  const openQuickEnquiry = useCallback((config) => {
    if (config?.source) {
      track('negotiate_click', {
        source: config.source,
        package_id: config.packageId || null,
      });
    }
    setQuickEnquiry({
      open: true,
      ...config,
    });
  }, []);

  const closeQuickEnquiry = useCallback(() => {
    setQuickEnquiry((prev) => ({ ...prev, open: false }));
  }, []);

  const showToast = useCallback((text) => {
    setToastMsg(text);
    setToastVisible(true);
    window.clearTimeout(window.__atlaToastTimer);
    window.__atlaToastTimer = window.setTimeout(() => {
      setToastVisible(false);
    }, 3200);
  }, []);

  const showSlashPopup = useCallback((message) => {
    setSlashPopup({ open: true, message: String(message || '').trim() });
  }, []);

  const closeSlashPopup = useCallback(() => {
    setSlashPopup((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ModalContext.Provider
      value={{
        practiceModal,
        openPractice,
        closePractice,
        askModalOpen,
        openAsk,
        closeAsk,
        messages,
        askBusy,
        askAtla,
        clearChat,
        finishBotMessage,
        logAskClick,
        askConversationIdRef,
        quickEnquiry,
        openQuickEnquiry,
        closeQuickEnquiry,
        toastMsg,
        toastVisible,
        showToast,
        slashPopup,
        showSlashPopup,
        closeSlashPopup,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error('useModals must be used inside ModalProvider');
  return ctx;
}
