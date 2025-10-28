import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import StarsBackground from '@/components/stars-background';

export const metadata: Metadata = {
  title: 'Skyflix Emotion Quiz',
  description: 'An interactive quiz to discover Skyflix.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <StarsBackground />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
