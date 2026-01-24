import { Building2, Code, Briefcase, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DepartmentBadgeProps {
  department: string;
  year: number;
  semester: number;
  section?: string;
  compact?: boolean;
}

const departmentConfig: Record<string, { 
  icon: React.ElementType; 
  className: string;
  bgClass: string;
}> = {
  CSE: { 
    icon: Code, 
    className: 'text-white',
    bgClass: 'bg-gradient-to-r from-cyan-500 to-blue-500',
  },
  CE: { 
    icon: Building2, 
    className: 'text-white',
    bgClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
  },
  BBA: { 
    icon: Briefcase, 
    className: 'text-white',
    bgClass: 'bg-gradient-to-r from-purple-500 to-pink-500',
  },
  English: { 
    icon: BookOpen, 
    className: 'text-white',
    bgClass: 'bg-gradient-to-r from-rose-500 to-orange-500',
  },
};

export const DepartmentBadge = ({ department, year, semester, section, compact }: DepartmentBadgeProps) => {
  const config = departmentConfig[department] || departmentConfig.CSE;
  const Icon = config.icon;

  const yearLabel = `${year}-${semester === 1 ? 'I' : 'II'}`;

  if (compact) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold',
        config.bgClass,
        config.className
      )}>
        <Icon className="w-3 h-3" />
        {department} {yearLabel}
        {section && ` ${section}`}
      </span>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-sm',
        config.bgClass,
        config.className
      )}>
        <Icon className="w-3.5 h-3.5" />
        {department}
      </span>
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        Year {year} • Sem {semester}
        {section && ` • Sec ${section}`}
      </span>
    </div>
  );
};
