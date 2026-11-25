import Eyebrow from '../Eyebrow';
import Icon from '../Icon';
import './WhyUs.css';

const REASONS = [
  [
    'target',
    'A system, not guesswork',
    'A proven 6-layer, 5D method with a stated impact and a metric for every service. Growth by design, not by luck.',
  ],
  [
    'ai',
    'AI-native delivery',
    'We use AI throughout our own work, so you get enterprise speed and scale without agency bloat.',
  ],
  [
    'link',
    'Marketing + technology, together',
    'Brand, marketing, software and AI under one roof, so nothing falls between vendors.',
  ],
  [
    'data',
    'Transparent dashboards',
    'Live visibility on spend, leads, operations and performance whenever you want it.',
  ],
  [
    'academy',
    'We transfer capability',
    "ATLA Academy trains your team, so growth doesn't depend only on us.",
  ],
  [
    'lock',
    'Responsible by design',
    'DPDP-aware data handling, ASCI-compliant influencer work and ethical AI in every engagement.',
  ],
];

export default function WhyUs() {
  return (
    <div className="section" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Why ATLABTS</Eyebrow>
          <h2>
            Built for <span className="grad">credibility</span>, measured in outcomes
          </h2>
        </div>

        <div className="why-grid">
          {REASONS.map(([icon, title, desc]) => (
            <div key={title} className="why neu">
              <div className="logo-mark">
                <Icon name={icon} />
              </div>
              <h4>{title}</h4>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

