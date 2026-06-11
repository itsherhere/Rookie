import { Sidebar } from '@/components/layout/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F7FF]">
      <Sidebar role="admin" />
      <main className="ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
