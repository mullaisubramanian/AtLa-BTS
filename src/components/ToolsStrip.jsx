import './ToolsStrip.css';

const TOOLS = [
  { name: 'Claude (Anthropic)', short: 'Claude', src: '/logos/claude.svg' },
  { name: 'OpenAI', short: 'OpenAI', src: '/logos/openai.svg' },
  { name: 'Google Gemini', short: 'Google Gemini', src: '/logos/gemini.svg' },
  { name: 'Higgsfield', short: 'Higgsfield', src: '/logos/higgsfield.svg' },
  { name: 'Supabase', short: 'Supabase', src: '/logos/supabase.svg' },
  { name: 'Vercel', short: 'Vercel', src: '/logos/vercel.svg' },
  { name: 'Google Analytics', short: 'Google Analytics', src: '/logos/google-analytics.svg' },
  { name: 'Meta Business', short: 'Meta Business', src: '/logos/meta.svg' },
  { name: 'Canva', short: 'Canva', src: '/logos/canva.svg' },
  { name: 'Zoho', short: 'Zoho', src: '/logos/zoho.svg' },
];

export default function ToolsStrip() {
  return (
    <section className="section tools-strip-sec" aria-labelledby="tools-heading">
      <div className="wrap">
        <div className="tools-box glass">
          <div className="tools-head">
            <h2 id="tools-heading">We work with</h2>
          </div>

          <ul className="tools-list">
            {TOOLS.map((tool) => (
              <li key={tool.name} className="tool-item" tabIndex={0}>
                <img
                  src={tool.src}
                  alt={tool.name}
                  height={28}
                  loading="lazy"
                  decoding="async"
                />
                <span>{tool.short}</span>
              </li>
            ))}
          </ul>

          <p className="tools-note">Logos are trademarks of their respective owners.</p>
        </div>
      </div>
    </section>
  );
}
