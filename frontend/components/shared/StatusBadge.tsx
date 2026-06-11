import { cn } from '@/lib/utils';

type BadgeStatus =
  | 'applied'
  | 'reviewed'
  | 'shortlisted'
  | 'interview'
  | 'rejected'
  | 'hired'
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'completed'
  | 'draft'
  | 'published'
  | 'closed'
  | 'active'
  | 'on_leave'
  | 'resigned'
  | 'paid'
  | 'approved';

const styles: Record<BadgeStatus, string> = {
  applied: 'bg-[#EEF2FF] text-[#4338CA]',
  reviewed: 'bg-[#E0F2FE] text-[#0369A1]',
  shortlisted: 'bg-[#F3E8FF] text-[#7E22CE]',
  interview: 'bg-[#ECFDF5] text-[#047857]',
  hired: 'bg-[#DCFCE7] text-[#15803D]',
  rejected: 'bg-[#FEF2F2] text-[#991B1B]',
  pending: 'bg-[#FFF7ED] text-[#B45309]',
  accepted: 'bg-[#ECFDF5] text-[#047857]',
  declined: 'bg-[#FEF2F2] text-[#991B1B]',
  completed: 'bg-[#E0F2FE] text-[#0369A1]',
  draft: 'bg-[#F1F5F9] text-[#475569]',
  published: 'bg-[#ECFDF5] text-[#047857]',
  closed: 'bg-[#F1F5F9] text-[#475569]',
  active: 'bg-[#ECFDF5] text-[#047857]',
  on_leave: 'bg-[#FFF7ED] text-[#B45309]',
  resigned: 'bg-[#FEF2F2] text-[#991B1B]',
  paid: 'bg-[#ECFDF5] text-[#047857]',
  approved: 'bg-[#DCFCE7] text-[#15803D]',
};

const labels: Record<BadgeStatus, string> = {
  applied: 'Applied',
  reviewed: 'Reviewed',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  hired: 'Hired',
  rejected: 'Rejected',
  pending: 'Pending',
  accepted: 'Accepted',
  declined: 'Declined',
  completed: 'Completed',
  draft: 'Draft',
  published: 'Published',
  closed: 'Closed',
  active: 'Active',
  on_leave: 'On Leave',
  resigned: 'Resigned',
  paid: 'Paid',
  approved: 'Approved',
};

interface StatusBadgeProps {
  status: BadgeStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap',
        styles[status],
        className
      )}
    >
      {labels[status]}
    </span>
  );
}
