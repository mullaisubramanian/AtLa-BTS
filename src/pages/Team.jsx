import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Seo from '../components/Seo';
import Eyebrow from '../components/Eyebrow';
import Slash from '../components/Slash';
import TeamScorecardForm from '../components/TeamScorecardForm';
import './Team.css';

export default function Team() {
  const { hash } = useLocation();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (hash === '#apply') {
      setFormOpen(true);
    }
  }, [hash]);

  return (
    <section className="page-enter">
      <Seo
        title="Team — Meet Slash | AtLa/BTS"
        description="Meet Slash, AtLa/BTS's AI Success Manager, and express interest in joining our marketing, design, engineering, AI automation or influencer community."
        path="/team"
        breadcrumbs={[
          { name: 'Home', path: '/' },
          { name: 'Team', path: '/team' },
        ]}
      />

      <div className="section">
        <div className="wrap team-wrap">
          <div className="sec-head">
            <Eyebrow>Team</Eyebrow>
            <h1>
              Meet <span className="grad">Slash</span>
            </h1>
            <p>
              Our AI Success Manager welcomes every client and applicant at AtLa/BTS and routes you
              straight to the right specialist.
            </p>
          </div>

          <div className="team-grid">
            <article className="team-slash-card neu">
              <div className="team-slash-avatar">
                <Slash size={160} />
              </div>
              <h2>Slash</h2>
              <p className="team-slash-role">AI Success Manager</p>
              <ul className="team-slash-lines">
                <li>First point of contact for every client</li>
                <li>Available 24/7 on atlabts.com</li>
                <li>Hands you to the right specialist</li>
              </ul>
            </article>

            <div className="team-apply-col">
              {!formOpen ? (
                <div className="team-join-card glass">
                  <Eyebrow>Join us</Eyebrow>
                  <h2>Want to be part of our team?</h2>
                  <p>
                    Whether you build campaigns, create content, engineer platforms, automate
                    workflows or partner as a creator, share your profile and Slash will pass it to
                    HR.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => setFormOpen(true)}
                  >
                    Apply now →
                  </button>
                </div>
              ) : (
                <TeamScorecardForm onSubmitted={() => setFormOpen(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
