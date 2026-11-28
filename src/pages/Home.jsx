import { useCallback, useState } from 'react';
import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import CinematicStory from '../components/home/CinematicStory';
import SlashStoryGuide from '../components/home/SlashStoryGuide';
import OrbitStage from '../components/AskAtla/OrbitStage';
import SystemLayers from '../components/home/SystemLayers';
import WhoWeServe from '../components/home/WhoWeServe';
import WebShowcase from '../components/home/WebShowcase';
import PracticesGrid from '../components/home/PracticesGrid';
import FiveDLoop from '../components/home/FiveDLoop';
import FutureOfSearch from '../components/home/FutureOfSearch';
import WhyUs from '../components/home/WhyUs';
import ToolsStrip from '../components/ToolsStrip';
import CtaBand from '../components/home/CtaBand';
import LocationsSection from '../components/LocationsSection';

export default function Home() {
  const [storyState, setStoryState] = useState({
    progress: 0,
    activeScene: 0,
    ended: false,
    visible: false,
  });

  const handleStoryState = useCallback((next) => {
    setStoryState(next);
  }, []);

  return (
    <section className="page-enter">
      <Seo
        title="AtLa/BTS — Business Transformation System"
        description="AtLa/BTS unites growth marketing, brand, AI search (SEO, AEO, GEO), automation, software platforms and academy training in one measurable system."
        path="/"
      />

      <CinematicStory onStoryState={handleStoryState} />
      <ToolsStrip />
      <LocationsSection />

      <div className="ask-sec">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: '10px' }}>
            <Eyebrow>Ask AtLa/BTS</Eyebrow>
            <h2>
              What does your business <span className="grad">need next?</span>
            </h2>
            <p>
              Describe your challenge in plain words. AtLa/BTS finds the right services, explains the
              impact and suggests your next step.
            </p>
          </div>
          <OrbitStage />
        </div>
      </div>

      <SystemLayers />
      <WhoWeServe />
      <WebShowcase />
      <PracticesGrid />
      <FiveDLoop />
      <FutureOfSearch />
      <WhyUs />
      <CtaBand />

      <SlashStoryGuide storyState={storyState} />
    </section>
  );
}

