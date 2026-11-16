'use client';

import React from 'react';
import { SmartAdvisorProvider } from '@/store/smartAdvisorStore';
import { DemoHeader } from '@/components/DemoHeader';
import { GlobalModals } from '@/components/GlobalModals';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SmartAdvisorProvider>
      <DemoHeader />
      <GlobalModals />
      {children}
    </SmartAdvisorProvider>
  );
}
