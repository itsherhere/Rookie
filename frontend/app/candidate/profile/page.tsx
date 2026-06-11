'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Save, Plus, X, User, MapPin, FileText, Briefcase, CheckCircle } from 'lucide-react';

interface Profile {
  full_name: string; bio: string; location: string;
  skills: string[]; experience_level: string;
  resume_url: string; portfolio_url: string;
}

const EXP = [
  { value: 'junior', label: 'Junior', desc: '0–2 yrs' },
  { value: 'mid', label: 'Mid', desc: '2–5 yrs' },
  { value: 'senior', label: 'Senior', desc: '5–8 yrs' },
  { value: 'lead', label: 'Lead', desc: '8+ yrs' },
];

function completion(p: Profile) {
  const fields = [p.full_name, p.bio, p.location, p.resume_url, p.skills.length > 0];
  return Math.round((fields.filter(Boolean).length / fields.length) * 100);
}

export default function CandidateProfilePage() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<Profile>({
    full_name: '', bio: '', location: '', skills: [],
    experience_level: 'junior', resume_url: '', portfolio_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const d = await res.json();
          setProfile({ full_name: d.full_name||'', bio: d.bio||'', location: d.location||'',
            skills: d.skills||[], experience_level: d.experience_level||'junior',
            resume_url: d.resume_url||'', portfolio_url: d.portfolio_url||'' });
        }
      } finally { setLoading(false); }
    })();
  }, []);

  async function save() {
    setSaving(true);
    try {
      const token = await getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/candidates/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profile),
      });
      setSaved(true); setTimeout(() => setSaved(false), 2500);
    } finally { setSaving(false); }
  }

  function addSkill() {
    const s = newSkill.trim();
    if (s && !profile.skills.includes(s)) setProfile(p => ({ ...p, skills: [...p.skills, s] }));
    setNewSkill('');
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 rounded-full border-2 border-[#5046E4] border-t-transparent animate-spin" />
    </div>
  );

  const pct = completion(profile);

  return (
    <div className="p-6 max-w-2xl">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">My Profile</h1>
          <p className="text-sm text-[#6B6888]">Visible to employers when you apply</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 flex-shrink-0"
          style={{ background: saved ? '#10B981' : '#5046E4' }}>
          {saved ? <CheckCircle size={15} /> : <Save size={15} />}
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save profile'}
        </button>
      </div>

      {/* Completion banner */}
      <div className="bg-white border border-[#E8E6F8] rounded-2xl p-4 mb-5">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-[#0F0F1A]">Profile completion</span>
          <span className="text-sm font-bold" style={{ color: pct === 100 ? '#10B981' : '#5046E4' }}>{pct}%</span>
        </div>
        <div className="h-2 bg-[#F7F7FF] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%`, background: pct === 100 ? '#10B981' : 'linear-gradient(90deg, #5046E4, #22D3EE)' }} />
        </div>
        {pct < 100 && (
          <p className="text-xs text-[#6B6888] mt-2">
            {!profile.full_name && '• Add your full name  '}
            {!profile.bio && '• Write a short bio  '}
            {!profile.location && '• Add your location  '}
            {profile.skills.length === 0 && '• Add skills  '}
            {!profile.resume_url && '• Add resume link'}
          </p>
        )}
      </div>

      <div className="space-y-4">
        {/* Basic info */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
              <User size={14} className="text-[#5046E4]" />
            </div>
            <h2 className="font-semibold text-[#0F0F1A]">Basic info</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#6B6888] mb-1.5">Full name</label>
              <input value={profile.full_name}
                onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 transition-all bg-[#FAFAFA]"
                placeholder="Jane Doe" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#6B6888] mb-1.5 flex items-center gap-1">
                <MapPin size={11} /> Location
              </label>
              <input value={profile.location}
                onChange={e => setProfile(p => ({ ...p, location: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 transition-all bg-[#FAFAFA]"
                placeholder="San Francisco, CA" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-xs font-medium text-[#6B6888] mb-1.5">Bio</label>
            <textarea value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 transition-all resize-none bg-[#FAFAFA]"
              placeholder="A short bio that helps employers understand who you are..." />
          </div>
        </div>

        {/* Experience */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
              <Briefcase size={14} className="text-[#5046E4]" />
            </div>
            <h2 className="font-semibold text-[#0F0F1A]">Experience level</h2>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {EXP.map(e => (
              <button key={e.value} onClick={() => setProfile(p => ({ ...p, experience_level: e.value }))}
                className="py-3 rounded-xl border-2 text-center transition-all"
                style={profile.experience_level === e.value
                  ? { borderColor: '#5046E4', background: '#EEF0FF' }
                  : { borderColor: '#E8E6F8', background: 'white' }}>
                <p className="text-sm font-bold text-[#0F0F1A]">{e.label}</p>
                <p className="text-xs text-[#6B6888]">{e.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Skills */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
                <span className="text-[#5046E4] text-xs font-black">✦</span>
              </div>
              <h2 className="font-semibold text-[#0F0F1A]">Skills</h2>
            </div>
            <span className="text-xs text-[#6B6888]">{profile.skills.length} added</span>
          </div>
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {profile.skills.map(skill => (
                <span key={skill} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#EEF0FF] text-[#5046E4]">
                  {skill}
                  <button onClick={() => setProfile(p => ({ ...p, skills: p.skills.filter(s => s !== skill) }))}
                    className="hover:text-red-500 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input value={newSkill} onChange={e => setNewSkill(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="Type a skill and press Enter..."
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] bg-[#FAFAFA]" />
            <button onClick={addSkill}
              className="w-10 h-10 rounded-xl bg-[#5046E4] text-white hover:bg-[#3D34C4] flex items-center justify-center transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        {/* Links */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-lg bg-[#EEF0FF] flex items-center justify-center">
              <FileText size={14} className="text-[#5046E4]" />
            </div>
            <h2 className="font-semibold text-[#0F0F1A]">Links</h2>
          </div>
          <div className="space-y-3">
            {[
              { key: 'resume_url', label: 'Resume URL', placeholder: 'https://drive.google.com/...' },
              { key: 'portfolio_url', label: 'Portfolio / GitHub', placeholder: 'https://github.com/yourusername' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-[#6B6888] mb-1.5">{f.label}</label>
                <input
                  value={(profile as any)[f.key]}
                  onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] text-sm text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] bg-[#FAFAFA] transition-all"
                  placeholder={f.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
