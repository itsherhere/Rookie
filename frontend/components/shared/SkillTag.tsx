import { cn } from '@/lib/utils';

type TagVariant = 'default' | 'matched' | 'missing';

interface SkillTagProps {
  skill: string;
  variant?: TagVariant;
  className?: string;
}

const variantStyles: Record<TagVariant, string> = {
  default: 'bg-[#EEF0FF] text-[#5046E4]',
  matched: 'bg-[#ECFDF5] text-[#047857]',
  missing: 'bg-[#FEF2F2] text-[#991B1B]',
};

export function SkillTag({ skill, variant = 'default', className }: SkillTagProps) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap', variantStyles[variant], className)}>
      {skill}
    </span>
  );
}
