'use client'
import { SignIn } from '@clerk/nextjs';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-y-auto px-4 py-12"
      style={{
        background:
          'radial-gradient(ellipse at top left, rgba(52,211,153,0.12) 0%, transparent 50%), radial-gradient(ellipse at bottom right, rgba(80,70,228,0.1) 0%, transparent 55%), #F0EEFF',
      }}
    >
      <style>{`
        .cl-rootBox { background: transparent !important; }
        .cl-cardBox { background: transparent !important; box-shadow: none !important; }
        .cl-footer { background: transparent !important; }
        .cl-footer > * { background: transparent !important; }
        .cl-footer > * > * { background: transparent !important; }
      `}</style>

      <Link href="/" className="flex items-center gap-2 mb-8 flex-shrink-0">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white text-sm" style={{ background: '#5046E4' }}>R</div>
        <span className="font-bold text-[#0F0F1A] text-base tracking-tight">Rookie</span>
      </Link>

      <SignIn
        appearance={{
          layout: { logoPlacement: 'none' },
          variables: {
            colorPrimary: '#5046E4',
            colorText: '#0F0F1A',
            colorTextSecondary: '#6B6888',
            colorBackground: '#ffffff',
            colorInputBackground: '#ffffff',
            colorInputText: '#0F0F1A',
            borderRadius: '0.75rem',
            fontFamily: 'inherit',
          },
          elements: {
            card: 'shadow-2xl rounded-2xl border border-[#E8E6F8]',
            formButtonPrimary: 'bg-[#5046E4] hover:bg-[#3D34C4] rounded-xl font-semibold transition-all',
            formFieldInput: 'rounded-xl border-[#E8E6F8] focus:border-[#5046E4]',
            formFieldLabel: 'text-[#0F0F1A] font-medium text-sm',
            footerActionLink: 'text-[#5046E4] font-semibold hover:text-[#3D34C4]',
            socialButtonsBlockButton: 'border-[#E8E6F8] rounded-xl hover:bg-[#F7F8FF] transition-all',
            dividerLine: 'bg-[#E8E6F8]',
            dividerText: 'text-[#6B6888] text-xs',
          },
        }}
      />

      <p className="mt-6 text-sm text-[#6B6888] flex-shrink-0">
        Don't have an account?{' '}
        <Link href="/sign-up" className="text-[#5046E4] font-semibold hover:underline">Sign up free →</Link>
      </p>
    </div>
  );
}
