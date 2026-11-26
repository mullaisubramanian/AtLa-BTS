import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PAGES } from '../../data/askAtla';
import { countServices } from '../../data/practices';
import { SITE_CONFIG } from '../../config/site';
import { track } from '../../lib/api';
import { useModals } from '../../context/ModalContext';
import { useReducedMotion } from '../../lib/useReducedMotion';
import RichText from '../RichText';
import ResultCard from './ResultCard';
import PageTile from './PageTile';
import './ChatMessage.css';

function tokenizeParts(parts) {
  const tokens = [];
  (parts || []).forEach((part) => {
    const text = typeof part === 'string' ? part : part.text;
    const bold = typeof part === 'object' && Boolean(part.bold);
    const chunks = text.split(/(\s+)/);
    chunks.forEach((chunk) => {
      if (chunk.length > 0) {
        tokens.push({ text: chunk, bold });
      }
    });
  });
  return tokens;
}

function renderTokens(tokens, count) {
  const slice = tokens.slice(0, count);
  const grouped = [];
  slice.forEach((tok) => {
    const prev = grouped[grouped.length - 1];
    if (prev && prev.bold === tok.bold) {
      prev.text += tok.text;
    } else {
      grouped.push({ text: tok.text, bold: tok.bold });
    }
  });
  return grouped.map((g, i) =>
    g.bold ? <strong key={i}>{g.text}</strong> : <span key={i}>{g.text}</span>
  );
}

export default function ChatMessage({ message, onRevealStart, onComplete }) {
  const { closeAsk, openPractice, logAskClick, openQuickEnquiry } = useModals();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const msgRef = useRef(null);
  const onRevealStartRef = useRef(onRevealStart);
  const onCompleteRef = useRef(onComplete);
  onRevealStartRef.current = onRevealStart;
  onCompleteRef.current = onComplete;

  const isBot = message.role === 'bot';
  const ans = message.answer;

  const firstTokens = useMemo(
    () => (isBot && ans?.p?.[0] ? tokenizeParts(ans.p[0]) : []),
    [isBot, ans]
  );

  const [phase, setPhase] = useState(() =>
    !isBot || message.status === 'done' ? 'done' : 'thinking'
  );
  const [typedCount, setTypedCount] = useState(() =>
    !isBot || message.status === 'done' ? firstTokens.length : 0
  );
  const [revealedBlocks, setRevealedBlocks] = useState(() =>
    !isBot || message.status === 'done' ? 99 : 0
  );

  const blocks = useMemo(() => {
    if (!isBot || !ans) return [];
    const list = [];
    (ans.p || []).slice(1).forEach((parts, idx) => {
      list.push({ type: 'p', key: `p-${idx}`, parts });
    });
    if (ans.list) {
      list.push({ type: 'list', key: 'list', items: ans.list });
    }
    if (ans.practices && ans.practices.length > 1) {
      list.push({ type: 'practices', key: 'practices', practices: ans.practices });
    }
    (ans.after || []).forEach((parts, idx) => {
      list.push({ type: 'p', key: `after-${idx}`, parts });
    });
    if (ans.pages) {
      list.push({ type: 'pages', key: 'pages', pages: ans.pages });
    }
    return list;
  }, [isBot, ans]);

  useEffect(() => {
    if (!isBot || message.status === 'done') return;

    if (reducedMotion) {
      setPhase('done');
      setTypedCount(firstTokens.length);
      setRevealedBlocks(blocks.length);
      onRevealStartRef.current?.(msgRef.current);
      onCompleteRef.current?.(message.id);
      return;
    }

    const timers = [];
    let intervalId = null;

    const thinkTimer = window.setTimeout(() => {
      setPhase('typing');
      let i = 0;
      intervalId = window.setInterval(() => {
        i += 2;
        setTypedCount(Math.min(i, firstTokens.length));
        if (i >= firstTokens.length) {
          window.clearInterval(intervalId);
          setPhase('revealing');
          onRevealStartRef.current?.(msgRef.current);

          blocks.forEach((_, k) => {
            const bt = window.setTimeout(() => {
              setRevealedBlocks(k + 1);
            }, 100 + k * 220);
            timers.push(bt);
          });

          const doneTimer = window.setTimeout(() => {
            setPhase('done');
            onCompleteRef.current?.(message.id);
          }, 100 + blocks.length * 220);
          timers.push(doneTimer);
        }
      }, 26);
    }, 800);

    timers.push(thinkTimer);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [isBot, message.id, message.status, firstTokens.length, blocks, reducedMotion]);

  const handleAction = (act, clickedLabel) => {
    if (clickedLabel) {
      logAskClick(clickedLabel);
    }
    closeAsk();
    if (act[0] === 'instagram') {
      track('negotiate_click', { source: 'ask_atla' });
      window.open(SITE_CONFIG.instagramUrl, '_blank', 'noopener,noreferrer');
    } else if (act[0] === 'open') {
      window.setTimeout(() => openPractice(act[1], act[2]), 60);
    } else if (act[0] === 'go') {
      navigate(act[1]);
    } else if (act[0] === 'contact') {
      openQuickEnquiry({
        source: 'ask_atla',
        title: clickedLabel === "Let's negotiate" ? "Let's negotiate" : 'Talk to a strategist',
        askQuestion: message.question,
        askConversationId: message.getConversationId?.() || null,
        interests: message.answer?.matchedPracticeId
          ? [message.answer.matchedPracticeId]
          : [],
        defaultMessage: `I asked AtLa/BTS AI: "${message.question}"\nI'd like to discuss this with a strategist.`,
      });
    }
  };

  if (!isBot) {
    return (
      <div className="msg user" ref={msgRef}>
        <div className="bub">{message.text}</div>
      </div>
    );
  }

  return (
    <div className="msg bot" ref={msgRef}>
      <div className="av">
        <img src="/logo.png" alt="AtLa/BTS AI" />
      </div>
      <div className="bub">
        {phase === 'thinking' ? (
          <span className="dots3" aria-label="Thinking">
            <i />
            <i />
            <i />
          </span>
        ) : (
          <>
            <p className={phase === 'typing' ? 'caret' : undefined}>
              {renderTokens(firstTokens, typedCount)}
            </p>
            {(phase === 'revealing' || phase === 'done') &&
              blocks.map((block, k) => {
                const isIn = revealedBlocks >= k + 1;
                return (
                  <div
                    key={block.key}
                    className={`reveal-item ${isIn ? 'in' : ''}`}
                  >
                    {block.type === 'p' && (
                      <p>
                        <RichText parts={block.parts} />
                      </p>
                    )}

                    {block.type === 'list' && (
                      <div className="res-list">
                        {block.items.map((item, idx) => (
                          <ResultCard
                            key={`${item.n}-${idx}`}
                            item={item}
                            onSelect={() => handleAction(item.act, item.n)}
                          />
                        ))}
                      </div>
                    )}

                    {block.type === 'practices' && (
                      <>
                        <div className="lbl">Related practices</div>
                        <div className="pages">
                          {block.practices.map((p) => (
                            <PageTile
                              key={p.id}
                              icon={p.id}
                              color={p.c}
                              title={p.title}
                              subtitle={`${countServices(p)} services`}
                              onClick={() => handleAction(['open', p.id], p.title)}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {block.type === 'pages' && (
                      <>
                        <div className="lbl">Go to</div>
                        <div className="pages">
                          {block.pages.map((key) => {
                            const g = PAGES[key];
                            if (!g) return null;
                            return (
                              <PageTile
                                key={key}
                                icon={g.icon}
                                color="#0fb5ad"
                                title={g.title}
                                subtitle={g.desc}
                                onClick={() =>
                                  handleAction(
                                    g.isInstagram
                                      ? ['instagram']
                                      : g.isContact
                                      ? ['contact']
                                      : ['go', g.path],
                                    g.title
                                  )
                                }
                              />
                            );
                          })}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
