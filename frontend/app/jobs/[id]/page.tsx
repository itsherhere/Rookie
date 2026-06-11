import { notFound } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Clock, DollarSign, Building2, ArrowLeft, Globe, Calendar } from 'lucide-react';
import { formatSalary, formatDate } from '@/lib/utils';
import { SkillTag } from '@/components/shared/SkillTag';
import { ROUTES } from '@/constants';
import type { Job } from '@/types';

interface JobWithCompany extends Job {
  companies: {
    id: string;
    name: string;
    logo_url?: string;
    industry?: string;
    size?: string;
    website?: string;
    description?: string;
  };
}

async function getJob(id: string): Promise<JobWithCompany | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch {
    return null;
  }
}

export default async function PublicJobPage({ params }: { params: { id: string } }) {
  const job = await getJob(params.id);
  if (!job || job.status !== 'published') notFound();

  const company = job.companies;

  return (
    <div className="min-h-screen bg-[#F7F7FF] pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Back */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6888] hover:text-[#0F0F1A] mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          All jobs
        </Link>

        {/* Job header */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 rounded-xl bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-10 h-10 object-contain rounded-lg" />
              ) : (
                <Building2 size={22} className="text-[#5046E4]" />
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[#0F0F1A] mb-1">{job.title}</h1>
              <p className="text-[#5046E4] font-medium">{company.name}</p>
            </div>
            <Link
              href={ROUTES.APPLY(job.id)}
              className="flex-shrink-0 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Apply now
            </Link>
          </div>

          {/* Meta info */}
          <div className="flex flex-wrap gap-4 text-sm text-[#6B6888] mb-6">
            {job.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={15} className="text-[#5046E4]" />
                {job.location}
              </span>
            )}
            {job.type && (
              <span className="flex items-center gap-1.5">
                <Clock size={15} className="text-[#5046E4]" />
                {job.type}
              </span>
            )}
            {(job.salary_min || job.salary_max) && (
              <span className="flex items-center gap-1.5">
                <DollarSign size={15} className="text-[#5046E4]" />
                {job.salary_min && job.salary_max
                  ? `${formatSalary(job.salary_min)} – ${formatSalary(job.salary_max)}`
                  : job.salary_min ? `From ${formatSalary(job.salary_min)}` : `Up to ${formatSalary(job.salary_max!)}`
                }
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Calendar size={15} className="text-[#5046E4]" />
              Posted {formatDate(job.created_at)}
            </span>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill) => <SkillTag key={skill} skill={skill} />)}
            </div>
          )}
        </div>

        {/* Description */}
        {job.description && (
          <div className="bg-white border border-[#E8E6F8] rounded-2xl p-8 mb-6">
            <h2 className="text-base font-semibold text-[#0F0F1A] mb-4">About the role</h2>
            <p className="text-sm text-[#0F0F1A] leading-relaxed whitespace-pre-wrap">{job.description}</p>
          </div>
        )}

        {/* Requirements */}
        {job.requirements && (
          <div className="bg-white border border-[#E8E6F8] rounded-2xl p-8 mb-6">
            <h2 className="text-base font-semibold text-[#0F0F1A] mb-4">Requirements</h2>
            <p className="text-sm text-[#0F0F1A] leading-relaxed whitespace-pre-wrap">{job.requirements}</p>
          </div>
        )}

        {/* Company */}
        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-8 mb-8">
          <h2 className="text-base font-semibold text-[#0F0F1A] mb-4">About {company.name}</h2>
          {company.description && (
            <p className="text-sm text-[#6B6888] leading-relaxed mb-4">{company.description}</p>
          )}
          <div className="flex flex-wrap gap-4 text-sm text-[#6B6888]">
            {company.industry && <span>{company.industry}</span>}
            {company.size && <span>{company.size} employees</span>}
            {company.website && (
              <a href={company.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#5046E4] hover:underline">
                <Globe size={13} /> Website
              </a>
            )}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href={ROUTES.APPLY(job.id)}
            className="inline-flex items-center gap-2 bg-[#5046E4] hover:bg-[#3D34C4] text-white px-8 py-3.5 rounded-xl text-sm font-semibold transition-colors"
          >
            Apply for this position
          </Link>
          <p className="text-xs text-[#6B6888] mt-3">Takes less than 2 minutes</p>
        </div>
      </div>
    </div>
  );
}
