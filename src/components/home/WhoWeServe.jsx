import { AUDIENCES, IND } from '../../data/industries';
import Eyebrow from '../Eyebrow';
import Icon from '../Icon';
import './WhoWeServe.css';

export default function WhoWeServe() {
  return (
    <div className="section">
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Who we serve</Eyebrow>
          <h2>
            Wherever you are, <span className="grad">we take you further</span>
          </h2>
          <p>
            ATLABTS isn&apos;t only for startups. Most of our work is with established businesses
            that already have customers, teams and revenue, and want more of all three.
          </p>
        </div>

        <div className="aud-grid">
          {AUDIENCES.map((a) => (
            <div key={a.label} className="aud-card glass">
              <div className="em">
                <Icon name={a.icon} />
              </div>
              <small>{a.label}</small>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
              <ul>
                {a.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ marginTop: '30px' }} className="ind-grid">
          {IND.map(([icon, name]) => (
            <div key={name} className="ind neu">
              <div className="ind-ic">
                <Icon name={icon} color="#0fb5ad" wrap={false} />
              </div>
              {name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

