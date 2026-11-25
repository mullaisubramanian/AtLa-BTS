import { useCatalogue } from '../../context/CatalogueContext';
import { countServices } from '../../data/practices';
import { useModals } from '../../context/ModalContext';
import Eyebrow from '../Eyebrow';
import Icon from '../Icon';
import './PracticesGrid.css';

export default function PracticesGrid() {
  const { practices } = useCatalogue();
  const { openPractice } = useModals();

  return (
    <div className="section" style={{ paddingTop: '10px' }}>
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>Our Practices</Eyebrow>
          <h2>
            Eleven practices. <span className="grad">One transformation.</span>
          </h2>
          <p>
            Tap any practice to see every service inside it and the impact each one has on your
            business.
          </p>
        </div>

        <div className="mini-grid">
          {practices.map((p) => (
            <button
              key={p.id}
              type="button"
              className="mini glass"
              style={{ '--c': p.c }}
              onClick={() => openPractice(p.id)}
            >
              <div className="ic">
                <Icon name={p.id} color={p.c} wrap={false} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.tag}</p>
              <span className="n">{countServices(p)} services →</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

