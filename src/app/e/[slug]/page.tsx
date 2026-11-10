import { Attendee } from '@/components/attendee';
import { current,snapshot } from '@/server/read';
export const dynamic='force-dynamic';
export default async function Event({params}:{params:Promise<{slug:string}>}){
 const {slug}=await params;try{const pointer=current(slug),loaded=pointer?snapshot(slug,pointer.releaseNumber):undefined;
  return loaded?<Attendee initial={loaded.bundle} requestId={loaded.requestId}/>:<main className="shell"><p className="eyebrow">EVENT AGENDA</p><h1>Event details aren’t available right now.</h1><p>Try again soon, or contact the event organizer for help.</p><a className="button" href="/">Return home</a></main>
 }catch{return <main className="shell"><h1>Event details aren’t available right now.</h1><p>Please try again.</p></main>}
}
