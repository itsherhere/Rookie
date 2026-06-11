import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ApplySuccessPage() {
  return (
    <div className="min-h-screen bg-[#F7F7FF] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-[#ECFDF5] rounded-full mx-auto mb-6 flex items-center justify-center">
          <CheckCircle size={32} className="text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F0F1A] mb-3">Application submitted!</h1>
        <p className="text-[#6B6888] text-sm leading-relaxed mb-8">
          Your application has been received. The hiring team will review it and get back to you.
          We sent a confirmation to your email.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/candidate/applications" className="bg-[#5046E4] hover:bg-[#3D34C4] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Track my applications
          </Link>
          <Link href="/" className="border border-[#E8E6F8] text-[#6B6888] hover:text-[#0F0F1A] px-5 py-2.5 rounded-lg text-sm font-medium transition-colors">
            Browse more jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
