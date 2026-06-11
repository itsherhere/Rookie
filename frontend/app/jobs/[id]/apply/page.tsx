'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth, useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { SkillTag } from '@/components/shared/SkillTag';
import { ArrowLeft, Upload, CheckCircle } from 'lucide-react';
import type { Job } from '@/types';

interface JobWithCompany extends Job {
  companies: { name: string; logo_url?: string };
}

export default function ApplyPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();
  const { user } = useUser();
  const id = params.id as string;

  const [job, setJob] = useState<JobWithCompany | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');

  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  useEffect(() => {
    async function loadJob() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/jobs/${id}`);
        const data = await res.json();
        setJob(data.data);
      } catch {
        console.error('Failed to load job');
      } finally {
        setLoadingJob(false);
      }
    }
    loadJob();
  }, [id]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file');
      return;
    }
    setError('');
    setResumeFile(file);
  };

  const uploadResume = async (): Promise<string | null> => {
    if (!resumeFile) return null;
    setUploadingResume(true);

    const fileName = `${Date.now()}-${resumeFile.name.replace(/\s/g, '_')}`;

    const { data, error } = await supabase.storage
      .from('resumes')
      .upload(fileName, resumeFile, { cacheControl: '3600', upsert: false });

    setUploadingResume(false);

    if (error) {
      // Don't block submission — just warn and continue without resume
      console.warn('Resume upload failed:', error.message);
      return null;
    }

    const { data: urlData } = supabase.storage.from('resumes').getPublicUrl(data.path);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      // Try to upload resume — if it fails, submit without it
      let resumeUrl: string | null = null;
      if (resumeFile) {
        resumeUrl = await uploadResume();
      }

      const token = await getToken();
      await api.post(
        '/applications',
        { job_id: id, cover_letter: coverLetter, resume_url: resumeUrl },
        token!
      );

      router.push('/apply/success');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to submit application';
      setError(message);
      setSubmitting(false);
    }
  };

  if (loadingJob) {
    return (
      <div className="min-h-screen bg-[#F7F7FF] pt-24 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#F7F7FF] pt-24 px-6 text-center">
        <p className="text-[#6B6888]">Job not found.</p>
        <Link href="/" className="text-[#5046E4] text-sm mt-2 inline-block">Back to jobs</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F7FF] pt-24 pb-16 px-6">
      <div className="max-w-xl mx-auto">
        <Link
          href={`/jobs/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-[#6B6888] hover:text-[#0F0F1A] mb-8 transition-colors"
        >
          <ArrowLeft size={15} />
          Back to job
        </Link>

        <div className="bg-white border border-[#E8E6F8] rounded-2xl p-6 mb-6">
          <p className="text-xs text-[#6B6888] mb-1">Applying for</p>
          <h2 className="text-lg font-semibold text-[#0F0F1A]">{job.title}</h2>
          <p className="text-sm text-[#5046E4] mt-0.5">{job.companies?.name}</p>
          {job.skills?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {job.skills.slice(0, 5).map((s) => <SkillTag key={s} skill={s} />)}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
              Cover letter <span className="text-[#6B6888] font-normal">(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              placeholder={`Hi, I'm ${user?.firstName || 'applying'} and I'm excited about this opportunity because...`}
              rows={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E6F8] bg-white text-[#0F0F1A] placeholder:text-[#6B6888] focus:outline-none focus:border-[#5046E4] focus:ring-2 focus:ring-[#5046E4]/10 text-sm resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#0F0F1A] mb-1.5">
              Resume <span className="text-[#6B6888] font-normal">(PDF, optional)</span>
            </label>
            <label className="flex items-center gap-3 p-4 border-2 border-dashed border-[#E8E6F8] rounded-xl cursor-pointer hover:border-[#5046E4]/40 transition-colors">
              <input type="file" accept=".pdf" onChange={handleResumeChange} className="hidden" />
              {resumeFile ? (
                <>
                  <CheckCircle size={20} className="text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#0F0F1A]">{resumeFile.name}</p>
                    <p className="text-xs text-[#6B6888]">{(resumeFile.size / 1024).toFixed(0)} KB</p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={20} className="text-[#6B6888] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#0F0F1A]">Upload your resume</p>
                    <p className="text-xs text-[#6B6888]">PDF up to 5MB</p>
                  </div>
                </>
              )}
            </label>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={submitting || uploadingResume}
            className="w-full py-3 bg-[#5046E4] hover:bg-[#3D34C4] text-white rounded-xl font-medium text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {(submitting || uploadingResume) && <LoadingSpinner size="sm" />}
            {uploadingResume ? 'Uploading resume...' : submitting ? 'Submitting...' : 'Submit application'}
          </button>

          <p className="text-xs text-[#6B6888] text-center">
            By applying you confirm this information is accurate.
          </p>
        </form>
      </div>
    </div>
  );
}