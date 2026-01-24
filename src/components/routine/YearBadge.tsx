import { GraduationCap, Award, Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YearBadgeProps {
  year: number;
  semester: number;
  section?: string;
}

const yearConfig: Record<number, {
  icon: React.ElementType;
  label: string;
  className: string;
}> = {
  1: {
    icon: Sparkles,
    label: 'Freshman',
    className: 'bg-gradient-to-r from-green-500 to-emerald-500',
  },
  2: {
    icon: Star,
    label: 'Sophomore',
    className: 'bg-gradient-to-r from-blue-500 to-cyan-500',
  },
  3: {
    icon: Award,
    label: 'Junior',
    className: 'bg-gradient-to-r from-purple-500 to-violet-500',
  },
  4: {
    icon: GraduationCap,
    label: 'Senior',
    className: 'bg-gradient-to-r from-amber-500 to-orange-500',
  },
};

export const YearBadge = ({ year, semester, section }: YearBadgeProps) => {
  const config = yearConfig[year] || yearConfig[1];
  const Icon = config.icon;
  const semesterLabel = semester === 1 ? 'I' : 'II';

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-sm font-semibold shadow-lg',
      config.className
    )}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
      <span className="px-2 py-0.5 bg-white/20 rounded-full text-xs">
        Y{year}S{semesterLabel}
        {section && ` ${section}`}
      </span>
    </div>
  );
};
