import { notFound } from 'next/navigation';
import { Attendee } from '@/components/attendee';
import { demo } from '@/demo';

const profiles={
  maya:{name:'Maya',description:'Maya prefers picture-led information and concise next steps.',format:'pictures' as const},
  jordan:{name:'Jordan',description:'Jordan prefers American Sign Language. Reviewed signing is currently unavailable in this sample.',format:'sign' as const},
  sam:{name:'Sam',description:'Sam uses a screen reader and keyboard to navigate event information.',format:'text' as const},
};

export default async function RoleDemo({params}:{params:Promise<{role:string}>}){
  const {role}=await params;
  if(role==='priya')return <main className="shell"><p className="eyebrow" style={{marginTop:34}}>ORGANIZER DEMO · PRIYA</p><h1>What comes with Inclusive Design?</h1><p className="lead">A fictional, topic-focused sample agenda for the Inclusive Design Summit.</p><section className="session-card" style={{padding:26,marginTop:28}}><h2>Three sessions · two rooms</h2><ul>{demo.sessions.map(session=><li key={session.id}><strong>{session.title}</strong> — {new Intl.DateTimeFormat('en-US',{timeZone:demo.conference.timezone,hour:'numeric',minute:'2-digit'}).format(new Date(session.start))}, {demo.rooms.find(room=>room.id===session.roomId)?.name}</li>)}</ul><h2 style={{marginTop:24}}>Content readiness</h2><ul><li>Generated overview and session images are wired into the local demo; package representations remain awaiting review.</li><li>ASL session and orientation videos are awaiting permitted media and fluent review.</li><li>The package cannot pass the initial publication coverage gate.</li></ul><p>Review the agenda as an attendee, or use the operator CLI to validate and preview reviewed packages. This demo page is read-only and does not change event content.</p></section></main>;
  if(role==='sam')return <Attendee initial={demo} preview illustrationPreview kiosk minimal initialFormat="text"/>;
  const profile=profiles[role as keyof typeof profiles];
  if(!profile)notFound();
  return <Attendee initial={demo} preview illustrationPreview kiosk demoProfile={profile}/>;
}
