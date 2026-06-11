'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Calendar, Clock, Video, MapPin, Phone, Check, X } from 'lucide-react';

interface Interview {
  id: string; scheduled_at: string; type: string; status: string; notes: string;
  application: { id: string; job: { title: string; employer?: { company_name: string } } };
}

const TYPE_CFG: Record<string, { icon: React.ReactNode; label: string; color: string; bg: string }> = {
  online: { icon: <Video size={13} />, label: 'Online', color: '#5046E4', bg: '#EEF0FF' },
  onsite: { icon: <MapPin size={13} />, label: 'Onsite', color: '#F59E0B', bg: '#FFF7ED' },
  phone:  { icon: <Phone size={13} />,  label: 'Phone',  color: '#10B981', bg: '#ECFDF5' },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  scheduled: { label: 'Scheduled', color: '#5046E4', bg: '#EEF0FF' },
  confirmed: { label: 'Confirmed', color: '#10B981', bg: '#ECFDF5' },
  pending:   { label: 'Pending',   color: '#F59E0B', bg: '#FFF7ED' },
  cancelled: { label: 'Cancelled', color: '#F43F5E', bg: '#FFF1F2' },
  completed: { label: 'Completed', color: '#6B6888', bg: '#F7F7FF' },
};

export default function CandidateInterviewsPage() {
  const { getToken } = useAuth();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [responding, setResponding] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/candidate`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const json = await res.json();
          setInterviews(json.data ?? json ?? []);
        }
      } finally { setLoading(false); }
    })();
  }, []);

  async function respond(id: string, status: 'confirmed' | 'cancelled') {
    setResponding(id);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/interviews/${id}/respond`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      setInterviews(prev => prev.map(i => i.id === id ? { ...i, status } : i));
    } finally { setResponding(null); }
  }

  const upcoming = interviews.filter(i => ['scheduled','pending','confirmed'].includes(i.status));
  const past = interviews.filter(i => ['completed','cancelled'].includes(i.status));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
    </div>
  );

  const Card = ({ iv, dim }: { iv: Interview; dim?: boolean }) => {
    const sCfg = STATUS_CFG[iv.status] || STATUS_CFG.scheduled;
    const tCfg = TYPE_CFG[iv.type] || TYPE_CFG.online;
    const date = new Date(iv.scheduled_at);
    const isPending = ['pending','scheduled'].includes(iv.status);
    const initials = iv.application?.job?.employer?.company_name?.slice(0,2).toUpperCase() || 'CO';

    return (
      <div className={`bg-white border border-[#E8E6F8] rounded-2xl p-5 transition-all ${dim ? 'opacity-50' : 'hover:border-[#5046E4]/30 hover:shadow-sm'}`}>
        <div className="flex items-start gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #EEF0FF, #F0EEFF)', color: '#5046E4' }}>
            {initials}
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold text-[#0F0F1A] leading-tight">{iv.application?.job?.title}</h3>
                <p className="text-sm text-[#6B6888]">{iv.application?.job?.employer?.company_name}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
                style={{ background: sCfg.bg, color: sCfg.color }}>
                {sCfg.label}
              </span>
            </div>
          </div>
        </div>

        {/* Date/time/type row */}
        <div className="flex flex-wrap gap-3 mb-4 p-3 rounded-xl" style={{ background: '#F7F8FF' }}>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#0F0F1A]">
            <Calendar size={14} className="text-[#5046E4]" />
            {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-medium text-[#0F0F1A]">
            <Clock size={14} className="text-[#5046E4]" />
            {date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
          </span>
          <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg"
            style={{ background: tCfg.bg, color: tCfg.color }}>
            {tCfg.icon} {tCfg.label}
          </span>
        </div>

        {iv.notes && (
          <p className="text-xs text-[#6B6888] border-l-2 border-[#E8E6F8] pl-3 mb-4 italic">
            {iv.notes}
          </p>
        )}

        {isPending && (
          <div className="flex gap-2">
            <button onClick={() => respond(iv.id, 'confirmed')} disabled={responding === iv.id}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#10B981] hover:bg-[#059669] transition-all disabled:opacity-60">
              <Check size={14} /> Confirm
            </button>
            <button onClick={() => respond(iv.id, 'cancelled')} disabled={responding === iv.id}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
              style={{ background: '#FFF1F2', color: '#F43F5E' }}>
              <X size={14} /> Decline
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">Interviews</h1>
        <p className="text-sm text-[#6B6888]">{upcoming.length} upcoming · {past.length} past</p>
      </div>

      {interviews.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E6F8]">
          <div className="w-12 h-12 rounded-2xl bg-[#F7F7FF] flex items-center justify-center mx-auto mb-4">
            <Calendar size={22} className="text-[#E8E6F8]" />
          </div>
          <p className="font-semibold text-[#0F0F1A] mb-1">No interviews scheduled</p>
          <p className="text-sm text-[#6B6888]">Interviews will appear here once an employer invites you</p>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B6888] mb-3">Upcoming</p>
              <div className="space-y-3">{upcoming.map(i => <Card key={i.id} iv={i} />)}</div>
            </div>
          )}
          {past.length > 0 && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-[#6B6888] mb-3">Past</p>
              <div className="space-y-3">{past.map(i => <Card key={i.id} iv={i} dim />)}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
