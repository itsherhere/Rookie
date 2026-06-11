import Link from 'next/link';
import { MapPin, Clock, DollarSign, Building2 } from 'lucide-react';
import { formatSalary } from '@/lib/utils';
import { SkillTag } from './SkillTag';
import type { Job } from '@/types';

interface JobCardProps {
  job: Job & { companies?: { name: string; logo_url?: string } };
  href?: string;
}

function Card({ job }: { job: JobCardProps['job'] }) {
  return (
    <div className="bg-white border border-[#E8E6F8] rounded-xl p-5 hover:border-[#5046E4]/30 hover:shadow-sm transition-all">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-[#EEF0FF] flex items-center justify-center flex-shrink-0">
          <Building2 size={16} className="text-[#5046E4]" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-[#0F0F1A]">{job.title}</h3>
          {job.companies?.name && <p className="text-xs text-[#6B6888] mt-0.5">{job.companies.name}</p>}
        </div>
      </div>
      <div className="flex flex-wrap gap-3 text-xs text-[#6B6888] mb-3">
        {job.location && <span className="flex items-center gap-1"><MapPin size={11} />{job.location}</span>}
        {job.type && <span className="flex items-center gap-1"><Clock size={11} />{job.type}</span>}
        {(job.salary_min || job.salary_max) && (
          <span className="flex items-center gap-1">
            <DollarSign size={11} />
            {job.salary_min && job.salary_max ? `${formatSalary(job.salary_min)} – ${formatSalary(job.salary_max)}` : job.salary_min ? `From ${formatSalary(job.salary_min)}` : `Up to ${formatSalary(job.salary_max!)}`}
          </span>
        )}
      </div>
      {job.skills?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {job.skills.slice(0, 4).map((s) => <SkillTag key={s} skill={s} />)}
          {job.skills.length > 4 && <span className="text-xs text-[#6B6888] self-center">+{job.skills.length - 4}</span>}
        </div>
      )}
    </div>
  );
}

export function JobCard({ job, href }: JobCardProps) {
  if (href) return <Link href={href}><Card job={job} /></Link>;
  return <Card job={job} />;
}
