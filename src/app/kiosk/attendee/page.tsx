import { Attendee } from '@/components/attendee';
import { demo } from '@/demo';
import type { Preferences } from '@/domain/contracts';

const formats=['pictures','sign','text'] as const;
export default async function KioskAttendee({searchParams}:{searchParams:Promise<{format?:string}>}){
  const {format}=await searchParams;
  const initialFormat=formats.includes(format as (typeof formats)[number])?format as Preferences['primaryFormat']:'text';
  return <Attendee initial={demo} preview illustrationPreview kiosk initialFormat={initialFormat}/>;
}
