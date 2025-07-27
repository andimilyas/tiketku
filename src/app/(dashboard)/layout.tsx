import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';
import SessionClientProvider from '@/components/SessionClientProvider';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SessionClientProvider>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: '1rem' }}>{children}</main>
      </div>
    </SessionClientProvider>
  );
}
