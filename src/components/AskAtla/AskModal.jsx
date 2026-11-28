import { useEffect, useRef, useState } from 'react';
import { useModals } from '../../context/ModalContext';
import { useFocusTrap } from '../../lib/useFocusTrap';
import Slash from '../Slash';
import Icon from '../Icon';
import ChatMessage from './ChatMessage';
import './AskModal.css';

export default function AskModal() {
  const {
    askModalOpen,
    closeAsk,
    messages,
    askAtla,
    clearChat,
    finishBotMessage,
  } = useModals();

  const [followUp, setFollowUp] = useState('');
  const threadRef = useRef(null);
  const inputRef = useRef(null);
  const trapRef = useFocusTrap(askModalOpen, closeAsk);

  useEffect(() => {
    if (!askModalOpen || !threadRef.current) return;
    threadRef.current.scrollTo({
      top: threadRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [askModalOpen, messages.length]);

  const handleRevealStart = (botEl) => {
    if (!threadRef.current || !botEl) return;
    threadRef.current.scrollTo({
      top: botEl.offsetTop - threadRef.current.offsetTop - 8,
      behavior: 'smooth',
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!followUp.trim()) return;
    askAtla(followUp);
    setFollowUp('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!askModalOpen) return null;

  return (
    <div
      className="modal show"
      role="dialog"
      aria-modal="true"
      aria-labelledby="ask-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAsk();
      }}
    >
      <div className="ask-box" ref={trapRef}>
        <div className="ask-head">
          <Slash size={42} animated={false} />
          <div>
            <b id="ask-modal-title">AtLa/BTS AI</b>
            <small>Business growth assistant</small>
          </div>
          <button
            type="button"
            className="btn btn-neu"
            onClick={() => {
              clearChat();
              inputRef.current?.focus();
            }}
          >
            New chat
          </button>
          <button
            type="button"
            className="close"
            onClick={closeAsk}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="thread" ref={threadRef} aria-live="polite">
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              message={msg}
              onRevealStart={handleRevealStart}
              onComplete={finishBotMessage}
            />
          ))}
        </div>

        <form className="comp-row ask-foot" onSubmit={handleSubmit}>
          <textarea
            ref={inputRef}
            rows={1}
            value={followUp}
            aria-label="Ask a follow-up"
            placeholder="Ask a follow-up…"
            onChange={(e) => {
              setFollowUp(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
            }}
            onKeyDown={handleKeyDown}
          />
          <button type="submit" className="send" aria-label="Ask">
            <Icon name="up" color="currentColor" />
          </button>
        </form>
      </div>
    </div>
  );
}

