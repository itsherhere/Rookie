'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { SkillTag } from '@/components/shared/SkillTag';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ArrowLeft, MapPin, ExternalLink, FileText } from 'lucide-react';
import { ROUTES } from '@/constants';
import type { Application } from '@/types';

type ApplicationDetail = Application & {
  candidate_profiles: {
    full_name: string;
    current_title?: string;
    skills: string[];
    bio?: string;
    resume_url?: string;
    location?: string;
    linkedin_url?: string;
    portfolio_url?: string;
    experience_level?: string;
  } | null;
  jobs: { title: string; company_id: string; skills: string[] };
};

const STATUSES = ['applied', 'reviewed', 'shortlisted', 'interview', 'rejected', 'hired'];

export default function ApplicationDetailPage() {
  const params = useParams();
  const { getToken } = useAuth();
  const id = params.id as string;

  const [application, setApplication] = useState<ApplicationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const token = await getToken();
        const res = await api.get<ApplicationDetail>(`/applications/${id}`, token!);
        setApplication(res.data || null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, getToken]);

  const updateStatus = async (status: string) => {
    if (!application) return;
    setUpdating(true);
    try {
      const token = await getToken();
      await api.patch(`/applications/${id}/status`, { status }, token!);
      setApplication((a) => (a ? { ...a, status: status as Application['status'] } : a));
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="p-8">
        <p className="text-[#6B6888] mb-2">Application not found.</p>
        <Link href={ROUTES.EMPLOYER.APPLICATIONS} className="text-[#5046E4] text-sm">
          Back to applications
        </Link>
      </div>
    );
  }

  const profile = application.candidate_profiles;
  const jobSkills = application.jobs?.skills || [];
  const candidateSkills = profile?.skills || [];
  const matchedSkills = jobSkills.filter((s) =>
    candidateSkills.map((cs) => cs.toLowerCase()).includes(s.toLowerCase())
  );

  return (
    <div className="p-8 max-w-3xl">
      <Link
        href={ROUTES.EMPLOYER.APPLICATIONS}
        className="inline-flex items-center gap-1.5 text-sm text-[#6B6888] hover:text-[#0F0F1A] mb-6 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl font-semibold text-[#0F0F1A]">
            {profile?.full_name || 'Unknown candidate'}
          </h1>
          {profile?.current_title && (
            <p className="text-sm text-[#6B6888] mt-0.5">{profile.current_title}</p>
          )}
          {profile?.location && (
            <span className="flex items-center gap-1 text-sm text-[#6B6888] mt-0.5">
              <MapPin size={13} /> {profile.location}
            </span>
          )}
          {profile?.experience_level && (
            <span className="inline-block mt-1.5 px-2 py-0.5 bg-[#EEF0FF] text-[#5046E4] text-xs rounded-md font-medium capitalize">
              {profile.experience_level}
            </span>
          )}
        </div>

        {/* Status updater */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <StatusBadge status={application.status} />
          <div className="relative">
            {updating && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 rounded-lg z-10">
                <LoadingSpinner size="sm" />
              </div>
            )}
            <select
              value={application.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={updating}
              className="text-sm border border-[#E8E6F8] rounded-lg px-3 py-2 text-[#0F0F1A] focus:outline-none focus:border-[#5046E4] transition-colors bg-white"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Match score */}
      <div className="bg-white border border-[#E8E6F8] rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#0F0F1A]">Skill match</h2>
          <div className="flex items-center gap-2">
            <span
              className={`text-xl font-bold ${
                (application.match_score || 0) >= 70
                  ? 'text-emerald-600'
                  : (application.match_score || 0) >= 40
                  ? 'text-amber-600'
                  : 'text-[#6B6888]'
              }`}
            >
              {application.match_score ?? 0}%
            </span>
            <span className="text-xs text-[#6B6888]">
              {matchedSkills.length}/{jobSkills.length} skills matched
            </span>
          </div>
        </div>

        {jobSkills.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-[#6B6888] mb-2">Required skills</p>
            <div className="flex flex-wrap gap-1.5">
              {jobSkills.map((skill) => (
                <SkillTag
                  key={skill}
                  skill={skill}
                  variant={
                    candidateSkills.map((s) => s.toLowerCase()).includes(skill.toLowerCase())
                      ? 'matched'
                      : 'missing'
                  }
                />
              ))}
            </div>
          </div>
        )}

        {candidateSkills.length > 0 && (
          <div>
            <p className="text-xs text-[#6B6888] mb-2">Candidate skills</p>
            <div className="flex flex-wrap gap-1.5">
              {candidateSkills.map((skill) => (
                <SkillTag key={skill} skill={skill} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bio */}
      {profile?.bio && (
        <div className="bg-white border border-[#E8E6F8] rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-[#0F0F1A] mb-2">About</h2>
          <p className="text-sm text-[#6B6888] leading-relaxed">{profile.bio}</p>
        </div>
      )}

      {/* Cover letter */}
      {application.cover_letter && (
        <div className="bg-white border border-[#E8E6F8] rounded-xl p-5 mb-4">
          <h2 className="text-sm font-semibold text-[#0F0F1A] mb-2">Cover letter</h2>
          <p className="text-sm text-[#6B6888] leading-relaxed whitespace-pre-wrap">
            {application.cover_letter}
          </p>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-3">
        {profile?.resume_url && (
          <a
            href={profile.resume_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E6F8] rounded-lg text-sm text-[#0F0F1A] hover:border-[#5046E4]/40 transition-colors"
          >
            <FileText size={14} /> View resume
          </a>
        )}
        {profile?.linkedin_url && (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E6F8] rounded-lg text-sm text-[#0F0F1A] hover:border-[#5046E4]/40 transition-colors"
          >
            <ExternalLink size={14} /> LinkedIn
          </a>
        )}
        {profile?.portfolio_url && (
          <a
            href={profile.portfolio_url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-4 py-2 border border-[#E8E6F8] rounded-lg text-sm text-[#0F0F1A] hover:border-[#5046E4]/40 transition-colors"
          >
            <ExternalLink size={14} /> Portfolio
          </a>
        )}
      </div>
    </div>
  );
}
