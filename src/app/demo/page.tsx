import Link from 'next/link';

const roles=[
  {slug:'maya',name:'Maya · Picture-led attendee',detail:'Explore the session through a short picture sequence and a clear next step.'},
  {slug:'jordan',name:'Jordan · ASL attendee',detail:'See the ASL choice, its current coverage, and how missing reviewed signing is explained.'},
  {slug:'sam',name:'Sam · Screen-reader attendee',detail:'Explore the same agenda in accessible text with semantic controls and keyboard navigation.'},
  {slug:'priya',name:'Priya · Organizer',detail:'Review the sample package, its publication readiness, and the content still needed.'},
];

export default function DemoRoles(){return <main className="landing">
  <Link className="wordmark" href="/">Adaptive Conference</Link>
  <p className="eyebrow" style={{marginTop:36}}>ROLE-BASED DEMO</p>
  <h1>Choose a demo journey.</h1>
  <p className="lead">Each page shows the conference from one user’s point of view. These are fictional demo personas, not presets based on identity.</p>
  <div className="preview-grid">{roles.map(role=><article key={role.slug}><h2>{role.name}</h2><p>{role.detail}</p><Link className="button" style={{marginTop:18}} href={`/demo/${role.slug}`}>Open {role.name.split(' · ')[0]}’s page <span aria-hidden="true">→</span></Link></article>)}</div>
  <p className="fine-print">The event content remains a local fictional sample. ASL video is not available until permitted content is reviewed by a fluent reviewer.</p>
</main>}
