import { Attendee } from '@/components/attendee';
import { demo } from '@/demo';

export default async function AccessibilityView({searchParams}:{searchParams:Promise<{session?:string}>}){
  const {session}=await searchParams;
  return <Attendee key={session??'first-session'} initial={demo} preview illustrationPreview kiosk minimal initialFormat="text" initialSessionId={session}/>;
}
