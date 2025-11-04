'use client';

import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import StarsBackground from '@/components/stars-background';
import Script from 'next/script';
import { Inter } from 'next/font/google';
// import MusicPlayer from '@/components/music-player'; // componente removido
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

const inter = Inter({ subsets: ['latin'] });

type MusicContextType = {
  isMuted: boolean;
  toggleMute: () => void;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function useMusic() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  return (
    <html lang="pt-BR" className="dark">
      <head>
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXX');
          `}
        </Script>
      </head>
      <body className={`${inter.className} antialiased`}>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <div className="fixed inset-0 overflow-hidden z-[-1]">
          <div className="moving-stars-container">
            <StarsBackground />
            <StarsBackground />
          </div>
        </div>
        <div className="fixed top-0 left-0 right-0 h-48 bg-gradient-to-b from-background to-transparent z-0" />
        <MusicContext.Provider value={{ isMuted, toggleMute }}>
          {children}
          {/* MusicPlayer removido */}
        </MusicContext.Provider>
        <Toaster />
      </body>
    </html>
  );
}
