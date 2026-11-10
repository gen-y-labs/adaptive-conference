import Link from 'next/link';

const formats=[
  {id:'general',title:'General audience',detail:'A balanced default view with the full agenda and choices to switch formats.',icon:'◫',action:'Open standard view'},
  {id:'pictures',title:'Show me with pictures',detail:'Follow a short visual path to the session and room.',icon:'◈',action:'Use pictures'},
  {id:'sign',title:'Show me ASL',detail:'Choose American Sign Language. This sample clearly marks signing that is not yet available.',icon:'◉',action:'Use ASL'},
  {id:'accessibility',title:'Simple text view',detail:'A minimal page with session details, a simple session selector, and no extra controls.',icon:'Aa',action:'Open simple text view'},
];

export default function KioskStart(){return <main className="landing kiosk-landing">
  <span className="eyebrow">CONFERENCE WELCOME KIOSK</span>
  <h1>Welcome to Inclusive Design Summit.</h1>
  <p className="lead">Choose the standard overview or a view that works better for you. No account or personal details needed.</p>
  <div className="preview-grid kiosk-choice-grid" aria-label="Choose a way to explore the conference">{formats.map(format=><article key={format.id}><span className="preview-icon" aria-hidden="true">{format.icon}</span><h2>{format.title}</h2><p>{format.detail}</p><Link className="button primary kiosk-choice" href={format.id==='accessibility'?'/accessibility':`/kiosk/attendee?format=${format.id}`}>{format.action} <span aria-hidden="true">→</span></Link></article>)}</div>
  <p className="fine-print">The standard view is the default. This kiosk does not save your choices on this device.</p>
</main>}
