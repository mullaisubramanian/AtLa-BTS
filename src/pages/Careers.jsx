import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import Slash from '../components/Slash';
import CareerForm from '../components/CareerForm';
import './Careers.css';

export default function Careers() {
  return (
    <section className="page-enter">
      <Seo
        title="Careers at AtLa/BTS — Join Our Team"
        description="Apply to join AtLa/BTS in marketing, content, engineering, AI automation, sales or training."
        path="/careers"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Careers', path: '/careers' },
        ]}
      />

      <div className="section">
        <div className="wrap careers-wrap">
          <div className="sec-head">
            <Eyebrow>Careers</Eyebrow>
            <h1>
              Want to be part of <span className="grad">our team?</span>
            </h1>
            <p>
              We build strategy, brand, web platforms, AI automation and academy programmes from
              Coimbatore for clients across India and the world.
            </p>
          </div>

          <div className="careers-grid">
            <aside className="careers-slash-card neu">
              <Slash size={88} />
              <h2>Meet Slash, your AI Success Manager</h2>
              <p>
                Slash is the first point of contact at AtLa/BTS. Tell Slash what you bring, and our
                HR and practice leads will review your application personally.
              </p>
              <ul className="careers-points">
                <li>Remote-friendly &amp; Coimbatore studio roles</li>
                <li>Cross-disciplinary work across brand, software &amp; AI</li>
                <li>Direct mentorship with senior strategists &amp; engineers</li>
              </ul>
            </aside>

            <div>
              <CareerForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

