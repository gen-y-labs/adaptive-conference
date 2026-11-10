import Link from 'next/link';
export default function Home(){return <main className="landing">
  <span className="eyebrow">ONE EVENT · MORE WAYS IN</span>
  <h1>Conference information that works for you.</h1>
  <p className="lead">Explore an Inclusive Design Summit agenda through pictures, ASL availability, or accessible text.</p>
  <div className="preview-grid" aria-label="Communication format previews">
    <article><span aria-hidden="true" className="preview-icon">◫</span><h2>See the steps</h2><p>Follow a simple picture sequence to understand the session and what to do next.</p></article>
    <article><span aria-hidden="true" className="preview-icon">◉</span><h2>Watch signing</h2><p>Choose a prepared sign language when reviewed event content is available.</p></article>
    <article><span aria-hidden="true" className="preview-icon">Aa</span><h2>Read or listen</h2><p>Use the same clear event details with a keyboard or screen reader.</p></article>
  </div>
  <div className="home-actions"><Link className="button primary" href="/kiosk">Try the welcome kiosk <span aria-hidden="true">→</span></Link><Link className="button" href="/demo">Explore role-based demo pages</Link></div>
  <p className="fine-print">No account or diagnosis needed. Choose or change a format any time.</p>
</main>}
