import Eyebrow from '../Eyebrow';
import './FutureOfSearch.css';

export default function FutureOfSearch() {
  return (
    <div className="section" style={{ paddingTop: '20px' }}>
      <div className="wrap">
        <div className="sec-head">
          <Eyebrow>The Future of Search</Eyebrow>
          <h2>
            Your customers stopped just Googling. <span className="grad">They ask AI.</span>
          </h2>
          <p>
            We optimise your brand for all three layers of discovery, so you show up wherever the
            buying decision starts.
          </p>
        </div>

        <div className="evo">
          <div className="evo-card glass">
            <div className="tag grad">SEO</div>
            <h4>Search Engine Optimisation</h4>
            <p>
              Rank on Google and Maps when buyers search for what you sell. This is the foundation.
            </p>
          </div>
          <div className="evo-card glass">
            <div className="tag grad">AEO</div>
            <h4>Answer Engine Optimisation</h4>
            <p>
              Become the direct answer in Google AI Overviews, featured snippets and voice
              assistants.
            </p>
          </div>
          <div className="evo-card glass hot">
            <div className="tag">GEO</div>
            <h4>Generative Engine Optimisation</h4>
            <p>
              Get named and recommended when someone asks ChatGPT, Gemini or Perplexity for the best
              option.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

