import { Helmet } from 'react-helmet-async';
import { useModals } from '../context/ModalContext';
import Eyebrow from '../components/Eyebrow';
import './Academy.css';

const TRACKS = [
  {
    level: 'Beginner · Everyone',
    title: 'AI for Everyone',
    items: [
      'How AI works, without the jargon',
      'Prompt engineering that gets results',
      'Daily productivity with AI tools',
      'Safe & responsible AI use',
    ],
    outcomeLabel: 'You walk out:',
    outcome: 'saving 5–10 hours a week with AI.',
  },
  {
    level: 'Professional',
    title: 'AI for Marketers & Creators',
    items: [
      'AI content, image & video creation',
      'SEO → AEO → GEO playbook',
      'Reels strategy & personal branding',
      'Campaign analytics with AI',
    ],
    outcomeLabel: 'You walk out:',
    outcome: 'able to run a modern content engine on your own.',
  },
  {
    level: 'Professional',
    title: 'No-Code Automation & Agents',
    items: [
      'n8n, Make & Zapier workflows',
      'Build chatbots & AI agents',
      'CRM & lead automation',
      'Custom GPTs for your business',
    ],
    outcomeLabel: 'You walk out:',
    outcome: 'with working automations live in your business.',
  },
  {
    level: 'Corporate',
    title: 'Team & Leadership Programmes',
    items: [
      'Leadership AI strategy briefings',
      'Department-wise AI upskilling (sales, HR, finance, ops)',
      'AI policy & governance workshop',
      'Custom in-house bootcamps',
    ],
    outcomeLabel: 'Your team walks out:',
    outcome: 'with an AI adoption plan they own.',
  },
  {
    level: 'Students & Institutions',
    title: 'Future Skills Bootcamps',
    items: [
      'Design thinking workshops',
      'Hackathons & product challenges',
      'Faculty development programmes (FDPs)',
      'Industry-ready certifications',
    ],
    outcomeLabel: 'Students walk out:',
    outcome: 'with a portfolio and job-ready skills.',
  },
  {
    level: 'Founders & Leaders',
    title: 'Founder Growth Lab',
    items: [
      'Positioning & brand storytelling',
      'Building in public on LinkedIn',
      'Pitching & investor narrative',
      'Productising your expertise',
    ],
    outcomeLabel: 'You walk out:',
    outcome: 'with a clear story the market remembers.',
  },
];

export default function Academy() {
  const { openQuickEnquiry } = useModals();

  return (
    <section className="page-enter">
      <Helmet>
        <title>ATLA Academy — AtLa/BTS</title>
        <meta property="og:title" content="ATLA Academy — AtLa/BTS" />
        <meta
          name="description"
          content="Hands-on programmes in AI, digital growth, automation and branding for individuals, corporate teams, students and institutions."
        />
      </Helmet>

      <div className="section">
        <div className="wrap">
          <div className="sec-head">
            <Eyebrow>ATLA Academy</Eyebrow>
            <h2>
              Learn what we do. <span className="grad">Lead what&apos;s next.</span>
            </h2>
            <p>
              Hands-on programmes in AI, digital growth, automation and branding for individuals,
              corporate teams, students and institutions. Taught by the people who do the work
              every day.
            </p>
          </div>

          <div className="track-grid">
            {TRACKS.map((trk) => (
              <div key={trk.title} className="trk neu">
                <div className="lvl">{trk.level}</div>
                <h3>{trk.title}</h3>
                <ul>
                  {trk.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="out">
                  <b>{trk.outcomeLabel}</b> {trk.outcome}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() =>
                openQuickEnquiry({
                  source: 'academy',
                  title: 'ATLA Academy Enquiry',
                  contextLabel: 'ATLA Academy',
                  interests: ['academy'],
                  academyTrack: 'AI for Everyone',
                  defaultMessage: 'I would like to enquire about an ATLA Academy programme.',
                })
              }
            >
              Enquire about a programme →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

