import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: 'SmartAdvisor NSU | Autonomous Advising & Registration Engine',
  description: 'CSE 327 Sec 04 (Spring 2026) | Supervised by Intisar Tahmeed Sir (ITN)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-slate-50 text-slate-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
