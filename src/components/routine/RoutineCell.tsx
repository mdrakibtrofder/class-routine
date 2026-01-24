import { cn } from '@/lib/utils';
import { ClassSession } from '@/types/routine';
import { getCourseByCode, getTeacherByCode } from '@/data/routineData';
import { DepartmentBadge } from './DepartmentBadge';
import { RoomBadge } from './RoomBadge';
import { BookOpen, FlaskConical } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoutineCellProps {
  session: ClassSession | null;
  isHighlighted: boolean;
  isFiltered: boolean;
  hasActiveFilters: boolean;
  onClick: () => void;
  colSpan?: number;
  isCurrentTime?: boolean;
}

export const RoutineCell = ({ 
  session, 
  isHighlighted, 
  isFiltered,
  hasActiveFilters,
  onClick, 
  colSpan = 1, 
  isCurrentTime 
}: RoutineCellProps) => {
  if (!session) {
    return (
      <td 
        className={cn(
          "routine-cell routine-cell-empty",
          isCurrentTime && "border-t-2 border-t-destructive"
        )}
        colSpan={colSpan}
      />
    );
  }

  const course = getCourseByCode(session.courseCode);
  const teacherNames = session.teacherCodes
    .map(code => getTeacherByCode(code)?.code)
    .filter(Boolean)
    .join(', ');

  const isSessional = course?.type === 'sessional';

  // If filters are active and this cell is not in the filtered results, hide it
  if (hasActiveFilters && !isFiltered) {
    return (
      <td 
        colSpan={colSpan}
        className={cn(
          "routine-cell routine-cell-empty opacity-20",
          isCurrentTime && "border-t-2 border-t-destructive"
        )}
      />
    );
  }

  const cellContent = (
    <td
      colSpan={colSpan}
      className={cn(
        'routine-cell cell-interactive group',
        'bg-[#1891CF]/90 border-[#1891CF]/50',
        'hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/20',
        isHighlighted && 'cell-highlighted ring-2 ring-primary ring-offset-2',
        isCurrentTime && 'border-t-2 border-t-destructive',
        'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 transition-all duration-200'
      )}
      onClick={onClick}
    >
      {/* Course Code & Teacher */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {isSessional ? (
            <FlaskConical className="w-4 h-4 text-white" />
          ) : (
            <BookOpen className="w-4 h-4 text-white" />
          )}
          <span className="font-bold text-sm text-white">
            {session.courseCode}
          </span>
        </div>
        <span className="text-xs font-medium bg-white/20 text-white px-1.5 py-0.5 rounded">
          {teacherNames}
        </span>
      </div>

      {/* Bottom Row: Room & Department */}
      <div className="flex items-center justify-between gap-2">
        <RoomBadge roomNo={session.roomNo} compact />
        <DepartmentBadge 
          department={session.department} 
          year={session.year} 
          semester={session.semester}
          section={session.section}
          compact
        />
      </div>

      {/* Hover indicator */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/15 transition-all duration-300 pointer-events-none" />
      
      {/* Type indicator line */}
      <div className="absolute top-0 left-0 w-1 h-full rounded-l-lg bg-white/40" />
    </td>
  );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {cellContent}
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <p className="font-medium">{course?.title || session.courseCode}</p>
          <p className="text-xs text-muted-foreground">
            {isSessional ? 'Sessional / Lab' : 'Theory'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
