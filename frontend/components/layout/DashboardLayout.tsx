interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export function DashboardLayout({ children, sidebar }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-brand-bg">
      {sidebar}
      <main className="ml-sidebar min-h-screen">
        {children}
      </main>
    </div>
  );
}
