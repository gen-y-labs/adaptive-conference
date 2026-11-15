import Link from 'next/link';
import Image from 'next/image';

const visitors=[
  {slug:'maya',name:'Maya',title:'Picture path',description:'A visual route, one step at a time.',symbol:'↗',tone:'picture'},
  {slug:'jordan',name:'Jordan',title:'ASL first',description:'A signing centered conference view.',symbol:'◉',tone:'sign'},
  {slug:'sam',name:'Sam',title:'Quiet text',description:'A calm, screen reader friendly agenda.',symbol:'Aa',tone:'text'},
];

export function KioskStart(){return <main className="match-screen">
  <header className="match-brand"><span className="brand-dot" aria-hidden="true"/>INCLUSIVE DESIGN SUMMIT<span className="brand-date">NOVEMBER 10 · DENVER</span></header>
  <section className="match-intro" aria-labelledby="welcome-title">
    <div className="match-copy"><p className="match-kicker">A CONFERENCE THAT MEETS YOU HERE</p><h1 id="welcome-title">Welcome.<br/>Your day, your way.</h1><p>At a live kiosk, an opted-in match can open the conference in the way you’ve chosen. This preview uses sample visitors so you can see how the whole experience changes.</p></div>
    <div className="match-visual event-overview-visual"><Image src="/demo-media/ids_image_overview.jpg" alt="The Inclusive Design Summit welcome desk, with green and blue floor paths leading into the conference." width={1600} height={893} sizes="(max-width: 800px) 90vw, 40vw" priority/></div>
  </section>
  <section className="match-options" aria-labelledby="match-heading"><div className="match-section-head"><div><p className="match-kicker">PREVIEW THE EXPERIENCE</p><h2 id="match-heading">Choose a sample match</h2></div><span className="demo-chip"><span aria-hidden="true">●</span> DEMO MODE</span></div>
    <div className="visitor-grid">{visitors.map(visitor=><Link key={visitor.slug} className={`visitor-card visitor-${visitor.tone}`} href={`/demo/${visitor.slug}`}><span className="visitor-symbol" aria-hidden="true">{visitor.symbol}</span><span className="visitor-copy"><strong>{visitor.name}</strong><span>{visitor.title}</span><small>{visitor.description}</small></span><span className="visitor-go" aria-hidden="true">↗</span></Link>)}</div>
    <Link className="general-entry" href="/kiosk/attendee?format=text"><span className="general-icon" aria-hidden="true">☼</span><span><strong>Continue as a general visitor</strong><small>Open the full conference agenda</small></span><span className="general-arrow" aria-hidden="true">→</span></Link>
  </section>
  <footer className="match-note"><span className="privacy-mark" aria-hidden="true">◎</span><span><strong>Your face is not your preference.</strong> A live system must ask permission and use only a visitor’s saved choice. This demo does not use a camera or identify anyone.</span></footer>
</main>}
