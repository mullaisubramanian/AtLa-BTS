import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from '../../lib/useReducedMotion';
import './CinematicStory.css';

const STORY_SCENES = [
  {
    id: 'hero',
    type: 'hero',
    videoBase: '/video/hero',
    title: 'AtLa/BTS',
    subtitle: 'Business Transformation System',
    bgClass: 'scene-bg-hero',
  },
  {
    id: 'ai',
    type: 'ai',
    videoBase: '/video/ai',
    title: 'We are an AI company.',
    body: 'We use AI and automation to turn growing businesses into category leaders.',
    ctaLabel: 'Explore AI Automation',
    ctaTo: '/services#ai',
    bgClass: 'scene-bg-ai',
  },
  {
    id: 'brand',
    type: 'scene',
    videoBase: '/video/brand',
    title: 'We build brands people remember.',
    body: 'Positioning, visual identity and creative campaigns that make you the obvious choice.',
    ctaLabel: 'Explore Brand Establishment',
    ctaTo: '/services#brand',
    bgClass: 'scene-bg-brand',
  },
  {
    id: 'automation',
    type: 'scene',
    videoBase: '/video/automation',
    title: 'We automate the work that slows you down.',
    body: 'AI agents, CRM pipelines and workflow automation running around the clock.',
    ctaLabel: 'Explore AI Automation',
    ctaTo: '/services#ai',
    bgClass: 'scene-bg-auto',
  },
  {
    id: 'search',
    type: 'scene',
    videoBase: '/video/search',
    title: 'We make Google and AI recommend you.',
    body: 'SEO, AEO and GEO built so buyers discover you in search results and AI answers.',
    ctaLabel: 'Explore AI Search & Visibility',
    ctaTo: '/services#search',
    bgClass: 'scene-bg-search',
  },
  {
    id: 'software',
    type: 'scene',
    videoBase: '/video/software',
    title: 'We build the software your business runs on.',
    body: 'Custom SaaS, ERP, CRM and high-converting web platforms engineered for scale.',
    ctaLabel: 'Explore Products & Platforms',
    ctaTo: '/services#product',
    bgClass: 'scene-bg-soft',
  },
];

function SceneBackground({ scene, isNear, isMobile, saveData, reducedMotion, eager }) {
  const [posterFailed, setPosterFailed] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  const shouldRenderVideo = !reducedMotion && !saveData && (eager || isNear) && !videoFailed;
  const mp4Src = isMobile ? `${scene.videoBase}-m.mp4` : `${scene.videoBase}.mp4`;
  const webmSrc = `${scene.videoBase}.webm`;
  const posterSrc = `${scene.videoBase}.jpg`;

  return (
    <div className={`story-bg ${scene.bgClass}`} aria-hidden="true">
      {!posterFailed && (eager || isNear || reducedMotion) && (
        <img
          src={posterSrc}
          alt=""
          className="story-poster"
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setPosterFailed(true)}
        />
      )}

      {shouldRenderVideo && (
        <video
          key={mp4Src}
          className={`story-video ${videoReady ? 'is-ready' : ''}`}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          width={isMobile ? 1280 : 1920}
          height={isMobile ? 720 : 1080}
          poster={posterFailed ? undefined : posterSrc}
          onLoadedData={() => setVideoReady(true)}
          onError={() => setVideoFailed(true)}
        >
          {!isMobile && <source src={webmSrc} type="video/webm" onError={() => setVideoFailed(true)} />}
          <source src={mp4Src} type="video/mp4" onError={() => setVideoFailed(true)} />
        </video>
      )}

      <div className="story-scrim" />
    </div>
  );
}

export default function CinematicStory({ onStoryState }) {
  const trackRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const [progress, setProgress] = useState(0);
  const [pastStory, setPastStory] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const updateMedia = () => {
      setIsMobile(mq.matches);
      setSaveData(Boolean(navigator.connection?.saveData));
    };
    updateMedia();
    mq.addEventListener('change', updateMedia);
    return () => mq.removeEventListener('change', updateMedia);
  }, []);

  useEffect(() => {
    if (reducedMotion) {
      onStoryState?.({ progress: 5.8, activeScene: 5, ended: true, visible: true });
      return;
    }

    let rafId = null;

    const measure = () => {
      rafId = null;
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 900;
      const scrollable = Math.max(1, rect.height - vh);
      const scrolled = Math.max(0, -rect.top);
      const raw = Math.min(STORY_SCENES.length - 0.01, (scrolled / scrollable) * STORY_SCENES.length);
      const ended = scrolled >= scrollable - 24;
      setProgress(raw);
      setPastStory(ended);

      const activeScene = Math.min(STORY_SCENES.length - 1, Math.floor(raw));
      onStoryState?.({
        progress: raw,
        activeScene,
        ended,
        visible: rect.top <= vh * 0.2,
      });
    };

    const onScroll = () => {
      if (rafId == null) {
        rafId = window.requestAnimationFrame(measure);
      }
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId != null) window.cancelAnimationFrame(rafId);
    };
  }, [reducedMotion, onStoryState]);

  const activeIndex = reducedMotion
    ? -1
    : Math.min(STORY_SCENES.length - 1, Math.max(0, Math.floor(progress)));

  // Scene 1 -> 2 transition dynamics
  const heroExit = reducedMotion ? 0 : Math.min(1, Math.max(0, (progress - 0.15) / 0.72));
  const heroScale = 1 - heroExit * 0.28;
  const heroOpacity = 1 - heroExit;

  return (
    <section
      ref={trackRef}
      className={`story-track ${reducedMotion ? 'is-reduced' : ''}`}
      aria-label="AtLa/BTS Transformation Story"
    >
      <div className={reducedMotion ? 'story-reduced-stack' : 'story-sticky'}>
        {STORY_SCENES.map((scene, idx) => {
          const isCurrent = reducedMotion || idx === activeIndex;
          const isNear = reducedMotion || Math.abs(progress - idx) <= 1.35;

          // Local scroll fraction [0..1] inside current scene
          const localP = reducedMotion ? 1 : Math.min(1, Math.max(0, progress - idx));

          if (scene.type === 'hero') {
            return (
              <div
                key={scene.id}
                className={`story-slide story-slide-hero ${isCurrent ? 'is-active' : ''}`}
                style={
                  reducedMotion
                    ? undefined
                    : {
                        opacity: heroOpacity,
                        pointerEvents: heroOpacity > 0.15 ? 'auto' : 'none',
                      }
                }
              >
                <SceneBackground
                  scene={scene}
                  isNear={isNear}
                  isMobile={isMobile}
                  saveData={saveData}
                  reducedMotion={reducedMotion}
                  eager
                />
                <div
                  className="story-hero-inner"
                  style={
                    reducedMotion
                      ? undefined
                      : {
                          transform: `scale(${heroScale.toFixed(3)})`,
                        }
                  }
                >
                  <h1 className="story-h1">{scene.title}</h1>
                  <p className="story-subtitle">{scene.subtitle}</p>
                </div>

                {!reducedMotion && (
                  <div
                    className="story-scroll-cue"
                    style={{ opacity: Math.max(0, 1 - heroExit * 2.5) }}
                    aria-hidden="true"
                  >
                    <span>Scroll</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          }

          // Scene 2..6
          const slideOpacity = reducedMotion
            ? 1
            : idx === 1 && progress < 1.0
            ? Math.min(1, Math.max(0, (progress - 0.52) / 0.38))
            : idx === activeIndex
            ? 1
            : 0;

          const words = scene.title.split(' ');
          const revealCount = reducedMotion
            ? words.length
            : idx === 1
            ? Math.ceil(Math.min(1, Math.max(0.15, (progress - 0.65) / 0.55)) * words.length)
            : Math.ceil(Math.min(1, Math.max(0.25, localP / 0.45 + 0.3)) * words.length);

          return (
            <div
              key={scene.id}
              className={`story-slide ${isCurrent ? 'is-active' : ''}`}
              style={
                reducedMotion
                  ? undefined
                  : {
                      opacity: slideOpacity,
                      pointerEvents: slideOpacity > 0.25 ? 'auto' : 'none',
                    }
              }
            >
              <SceneBackground
                scene={scene}
                isNear={isNear}
                isMobile={isMobile}
                saveData={saveData}
                reducedMotion={reducedMotion}
                eager={false}
              />

              <div className="wrap story-scene-inner">
                <span className="story-step-pill">
                  0{idx} / 05
                </span>
                <h2 className="story-h2">
                  <span className="story-sr">{scene.title}</span>
                  <span aria-hidden="true">
                    {words.map((word, wIdx) => (
                      <span
                        key={`${word}-${wIdx}`}
                        className={`story-word ${wIdx < revealCount ? 'is-shown' : ''}`}
                      >
                        {word}{' '}
                      </span>
                    ))}
                  </span>
                </h2>
                <p className="story-body">{scene.body}</p>
                <div className="story-actions">
                  <Link className="btn btn-primary story-explore" to={scene.ctaTo}>
                    {scene.ctaLabel} →
                  </Link>
                </div>
              </div>
            </div>
          );
        })}

        {!reducedMotion && !pastStory && activeIndex > 0 && (
          <div className="story-dots" aria-hidden="true">
            {STORY_SCENES.map((s, idx) => (
              <span key={s.id} className={idx === activeIndex ? 'is-on' : ''} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
