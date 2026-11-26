import { useEffect, useRef, useState } from 'react';
import { SUGG } from '../../data/askAtla';
import { useModals } from '../../context/ModalContext';
import Logo from '../Logo';
import Icon from '../Icon';
import './Composer.css';

export default function Composer() {
  const { askAtla } = useModals();
  const [value, setValue] = useState('');
  const [isNarrow, setIsNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 700 : false
  );
  const textareaRef = useRef(null);

  useEffect(() => {
    const onResize = () => setIsNarrow(window.innerWidth < 700);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const submitQuestion = () => {
    if (!value.trim()) return;
    askAtla(value);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleInput = (e) => {
    setValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submitQuestion();
    }
  };

  return (
    <div className="composer glass">
      <div className="comp-top">
        <Logo className="comp-logo" />
        <b>AtLa/BTS AI</b>
        <span className="comp-tag">Business growth assistant</span>
      </div>
      <form
        className="comp-row"
        onSubmit={(e) => {
          e.preventDefault();
          submitQuestion();
        }}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          aria-label="Ask AtLa/BTS AI"
          placeholder={
            isNarrow
              ? 'Ask AtLa/BTS anything…'
              : 'Ask anything… e.g. How do I get more leads for my business?'
          }
        />
        <button type="submit" className="send" aria-label="Ask">
          <Icon name="up" color="currentColor" />
        </button>
      </form>
      <div className="sugg">
        {SUGG.map((q) => (
          <button key={q} type="button" onClick={() => askAtla(q)}>
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

