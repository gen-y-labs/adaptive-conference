import type {Metadata} from 'next';import './styles.css';
export const metadata:Metadata={title:'Inclusive Design Summit · Adaptive Conference',description:'Explore an inclusive design conference through pictures, American Sign Language availability, and accessible text.'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
