import { Helmet } from 'react-helmet-async';
import Eyebrow from '../components/Eyebrow';
import Hero from '../components/home/Hero';
import OrbitStage from '../components/AskAtla/OrbitStage';
import SystemLayers from '../components/home/SystemLayers';
import WhoWeServe from '../components/home/WhoWeServe';
import WebShowcase from '../components/home/WebShowcase';
import PracticesGrid from '../components/home/PracticesGrid';
import FiveDLoop from '../components/home/FiveDLoop';
import FutureOfSearch from '../components/home/FutureOfSearch';
import WhyUs from '../components/home/WhyUs';
import CtaBand from '../components/home/CtaBand';

export default function Home() {
  return (
    <section className="page-enter">
      <Helmet>
        <title>ATLABTS — ATLA Business Transformation System</title>
        <meta
          name="description"
          content="ATLABTS — Digital Growth, AI Search (SEO, AEO, GEO), AI Automation, SaaS / ERP / CRM Platforms, Brand Establishment, Personal Branding, Influencer Connect, Data & Intelligence, Transformation Consulting and ATLA Academy."
        />
      </Helmet>

      <Hero />

      <div className="ask-sec">
        <div className="wrap">
          <div className="sec-head" style={{ marginBottom: '10px' }}>
            <Eyebrow>Ask ATLA</Eyebrow>
            <h2>
              What does your business <span className="grad">need next?</span>
            </h2>
            <p>
              Describe your challenge in plain words. ATLA finds the right services, explains the
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
    </section>
  );
}

