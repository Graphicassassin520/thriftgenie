
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThriftGenie - VERSION 3.0 SUBMIT FIXED',
  description: 'Transform your thrift finds into perfect listings with AI-powered magic. Submit button now working!',
  icons: {
    icon: '/favicon-fixed.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Ultra-aggressive cache busting for VERSION 3.0 */}
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate, max-age=0" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
        <meta name="cache-bust-v3" content={Date.now().toString()} />
        <meta name="build-id-v3" content="v3.0.2025-submit-fixed" />
        <meta name="deployment-version" content="3.0-SUBMIT-BUTTON-WORKING" />
        <meta name="last-updated" content="June 18, 2025 - Submit Button Fixed" />
        
        {/* Change favicon to signal deployment */}
        <link rel="icon" type="image/x-icon" href="/favicon-v3.ico" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon-v3.ico" />
        
        {/* Additional deployment markers */}
        <meta name="theme-color" content="#ff6b35" />
        <meta name="deployment-status" content="SUBMIT-BUTTON-FIXED" />
      </head>
      <body className={inter.className} style={{ backgroundColor: '#fff8f0' }}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* VERSION 3.0 Body Indicator */}
          <div className="fixed top-0 left-0 w-full h-2 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 z-50 shadow-lg"></div>
          
          {children}
          <Toaster />
          
          {/* Version indicator at bottom */}
          <div className="fixed bottom-0 right-0 bg-red-500 text-white px-4 py-2 text-xs font-bold z-50 rounded-tl-lg">
            V3.0 SUBMIT FIXED
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
