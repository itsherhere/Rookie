'use client';
import { useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';

export default function AuthRedirect() {
  const { getToken } = useAuth();
  const { isLoaded } = useUser();

  useEffect(() => {
    if (!isLoaded) return;

    async function redirect() {
      try {
        const token = await getToken();
        if (!token) { window.location.href = '/sign-in'; return; }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const json = await res.json();
          const role = json?.data?.role ?? json?.role;
          if (role === 'employer')  { window.location.href = '/employer/dashboard'; return; }
          if (role === 'candidate') { window.location.href = '/candidate/dashboard'; return; }
          if (role === 'admin')     { window.location.href = '/admin/dashboard'; return; }
        }
      } catch (e) {
        console.error(e);
      }
      window.location.href = '/onboarding';
    }

    redirect();
  }, [isLoaded]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0EEFF' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#5046E4] flex items-center justify-center text-white font-bold">R</div>
        <div className="w-5 h-5 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
      </div>
    </div>
  );
}
