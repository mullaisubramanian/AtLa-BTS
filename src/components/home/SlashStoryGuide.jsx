import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useModals } from '../../context/ModalContext';
import { useReducedMotion } from '../../lib/useReducedMotion';
import Slash from '../Slash';
import './SlashStoryGuide.css';

const SLASH_LINES = [
  {
    id: 1,
    audio: '/audio/slash-1.mp3',
    text: "Welcome to AtLa/BTS. I'm Slash, your AI Success Manager.",
  },
  {
    id: 2,
    audio: '/audio/slash-2.mp3',
    text: 'We are an AI company. We use AI to grow real businesses.',
  },
  {
    id: 3,
    audio: '/audio/slash-3.mp3',
    text: 'First, we make your brand impossible to ignore.',
  },
  {
    id: 4,
    audio: '/audio/slash-4.mp3',
    text: 'Then we automate the boring work, so your team can focus.',
  },
  {
    id: 5,
    audio: '/audio/slash-5.mp3',
    text: 'We make sure Google and AI assistants recommend you.',
  },
  {
    id: 6,
    audio: '/audio/slash-6.mp3',
    text: 'And we build the software your business runs on.',
  },
  {
    id: 7,
    audio: '/audio/slash-7.mp3',
    text: 'Want to see what fits you? Mix a Service Cocktail or talk to me.',
    isEnd: true,
  },
];

function getInitialClosed() {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem('atla_slash_guide_closed') === '1';
  } catch {
    return false;
  }
}

function getSavedVoicePref() {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('atla_slash_voice') === 'on';
  } catch {
    return false;
  }
}

export default function SlashStoryGuide({ storyState }) {
  const { openAsk } = useModals();
  const reducedMotion = useReducedMotion();
  const [closed, setClosed] = useState(getInitialClosed);
  const [voiceSavedOn, setVoiceSavedOn] = useState(getSavedVoicePref);
  const [userTappedSpeaker, setUserTappedSpeaker] = useState(false);
  const [typedLen, setTypedLen] = useState(0);

  const audioRef = useRef(null);

  const progress = storyState?.progress ?? 0;
  const ended = Boolean(storyState?.ended);

  // Visible from Scene 2 entry onward until closed
  const isVisible = !closed && (ended || progress >= 0.72);

  const currentLine = useMemo(() => {
    if (ended || progress >= 5.75) return SLASH_LINES[6];
    if (progress >= 5.05) return SLASH_LINES[5];
    if (progress >= 4.05) return SLASH_LINES[4];
    if (progress >= 3.05) return SLASH_LINES[3];
    if (progress >= 2.05) return SLASH_LINES[2];
    if (progress >= 1.15) return SLASH_LINES[1];
    return SLASH_LINES[0];
  }, [progress, ended]);

  // Typewriter effect per line
  useEffect(() => {
    if (!isVisible) return;
    if (reducedMotion) {
      setTypedLen(currentLine.text.length);
      return;
    }
    setTypedLen(0);
    let idx = 0;
    const timer = window.setInterval(() => {
      idx += 2;
      setTypedLen(Math.min(idx, currentLine.text.length));
      if (idx >= currentLine.text.length) {
        window.clearInterval(timer);
      }
    }, 24);
    return () => window.clearInterval(timer);
  }, [currentLine.id, currentLine.text, isVisible, reducedMotion]);

  const stopAllAudio = () => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch {
        // ignore
      }
      audioRef.current = null;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
  };

  const speakLine = (line) => {
    stopAllAudio();
    if (typeof window === 'undefined') return;

    let fellBack = false;
    const speakSpeechApi = () => {
      if (fellBack) return;
      fellBack = true;
      if (!('speechSynthesis' in window)) return;
      try {
        const utter = new SpeechSynthesisUtterance(line.text);
        const voices = window.speechSynthesis.getVoices() || [];
        const preferred =
          voices.find((v) => v.lang === 'en-IN') ||
          voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en'));
        if (preferred) utter.voice = preferred;
        utter.lang = preferred?.lang || 'en-IN';
        utter.rate = 1.02;
        window.speechSynthesis.speak(utter);
      } catch {
        // ignore speech errors
      }
    };

    try {
      const audio = new Audio(line.audio);
      audioRef.current = audio;
      audio.addEventListener('error', speakSpeechApi, { once: true });
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(speakSpeechApi);
      }
    } catch {
      speakSpeechApi();
    }
  };

  // Speak line transitions ONLY after the visitor tapped speaker in this session
  useEffect(() => {
    if (!isVisible || !userTappedSpeaker || !voiceSavedOn) return;
    speakLine(currentLine);
    return () => stopAllAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLine.id, isVisible, userTappedSpeaker, voiceSavedOn]);

  const handleClose = () => {
    stopAllAudio();
    setClosed(true);
    try {
      window.sessionStorage.setItem('atla_slash_guide_closed', '1');
    } catch {
      // ignore
    }
  };

  const handleToggleSpeaker = () => {
    const next = !(userTappedSpeaker && voiceSavedOn);
    setUserTappedSpeaker(true);
    setVoiceSavedOn(next);
    try {
      window.localStorage.setItem('atla_slash_voice', next ? 'on' : 'off');
    } catch {
      // ignore
    }
    if (next) {
      speakLine(currentLine);
    } else {
      stopAllAudio();
    }
  };

  if (!isVisible) return null;

  const voiceActive = userTappedSpeaker && voiceSavedOn;

  return (
    <aside className="slash-dock" aria-label="Slash story guide">
      <div className="slash-bubble glass">
        <div className="slash-bubble-top">
          <span className="slash-bubble-tag">Slash · AI Success Manager</span>
          <div className="slash-bubble-controls">
            <button
              type="button"
              className={`slash-icon-btn ${voiceActive ? 'is-on' : ''}`}
              onClick={handleToggleSpeaker}
              aria-pressed={voiceActive}
              aria-label={voiceActive ? 'Mute Slash voice' : 'Play Slash voice'}
              title={voiceActive ? 'Mute Slash voice' : 'Listen to Slash'}
            >
              {voiceActive ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                  <path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M11 5L6 9H2v6h4l5 4V5z" strokeLinejoin="round" />
                  <path d="M22 9l-6 6M16 9l6 6" strokeLinecap="round" />
                </svg>
              )}
            </button>
            <button
              type="button"
              className="slash-icon-btn"
              onClick={handleClose}
              aria-label="Dismiss Slash for this session"
            >
              ×
            </button>
          </div>
        </div>

        <p className="slash-bubble-text" aria-live="polite">
          {currentLine.text.slice(0, typedLen)}
        </p>

        {currentLine.isEnd && (
          <div className="slash-bubble-cta">
            <Link className="btn btn-primary slash-cta-btn" to="/service-cocktail">
              Mix a Service Cocktail
            </Link>
            <button type="button" className="btn btn-neu slash-cta-btn" onClick={openAsk}>
              Talk to Slash
            </button>
          </div>
        )}
      </div>

      <div className="slash-dock-avatar" aria-hidden="true">
        <Slash size={72} />
      </div>
    </aside>
  );
}
