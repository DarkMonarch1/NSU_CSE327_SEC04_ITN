import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SmartAdvisor NSU | Autonomous Advising & Registration',
  description: 'CSE 327 Sec 04 Course Project - Supervised by Intisar Tahmeed Sir (ITN)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen">{children}</body>
    </html>
  );
}
