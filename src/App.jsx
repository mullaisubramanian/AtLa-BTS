import { Suspense, lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import BackgroundBlobs from './components/Layout/BackgroundBlobs';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import FloatingTalkButton from './components/Layout/FloatingTalkButton';
import Toast from './components/Layout/Toast';
import PracticeModal from './components/PracticeModal';
import AskModal from './components/AskAtla/AskModal';
import QuickEnquiryModal from './components/QuickEnquiryModal';
import { track } from './lib/api';
import { initTracking } from './lib/session';
import Home from './pages/Home';

const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Cocktail = lazy(() => import('./pages/Cocktail'));
const Packages = lazy(() => import('./pages/Packages'));
const Academy = lazy(() => import('./pages/Academy'));
const Contact = lazy(() => import('./pages/Contact'));
const GetStarted = lazy(() => import('./pages/GetStarted'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const NotFound = lazy(() => import('./pages/NotFound'));

function ScrollAndTrackManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    initTracking();
    if (!pathname.startsWith('/admin')) {
      track('page_view', { pathname });
    }

    if (hash) {
      const targetId = hash.slice(1);
      const timer = window.setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 80);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
}

export default function App() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <>
        <ScrollAndTrackManager />
        <BackgroundBlobs />
        <Suspense
          fallback={
            <div className="section">
              <div className="wrap" style={{ textAlign: 'center', color: 'var(--muted)' }}>
                Loading…
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />} />
            <Route path="/admin/*" element={<AdminLayout />} />
          </Routes>
        </Suspense>
        <Toast />
      </>
    );
  }

  return (
    <>
      <ScrollAndTrackManager />
      <BackgroundBlobs />
      <Header />
      <main>
        <Suspense
          fallback={
            <div className="section">
              <div className="wrap" style={{ textAlign: 'center', color: 'var(--muted)' }}>
                Loading…
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-cocktail" element={<Cocktail />} />
            <Route path="/packages" element={<Packages />} />
            <Route path="/academy" element={<Academy />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/get-started" element={<GetStarted />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
      <FloatingTalkButton />
      <PracticeModal />
      <AskModal />
      <QuickEnquiryModal />
      <Toast />
    </>
  );
}
