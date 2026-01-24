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

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <td
            colSpan={colSpan}
            className={cn(
              'routine-cell cell-interactive group cursor-pointer',
              'bg-muted/50 border border-gray-400',
              'hover:bg-[#1891CF] hover:border-[#1891CF]',
              isHighlighted && 'cell-highlighted ring-2 ring-primary ring-offset-2',
              isCurrentTime && 'border-t-2 border-t-destructive'
            )}
            onClick={onClick}
          >
            {/* Course Code & Teacher */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                {isSessional ? (
                  <FlaskConical className="w-4 h-4 text-foreground group-hover:text-white" />
                ) : (
                  <BookOpen className="w-4 h-4 text-foreground group-hover:text-white" />
                )}
                <span className="font-bold text-sm text-foreground group-hover:text-white">
                  {session.courseCode}
                </span>
              </div>
              <span className="text-xs font-medium bg-blue-500 text-white px-1.5 py-0.5 rounded group-hover:bg-white/20">
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
          </td>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs z-50" sideOffset={5}>
          <p className="font-medium">{course?.title || session.courseCode}</p>
          <p className="text-xs text-muted-foreground">
            {isSessional ? 'Sessional / Lab' : 'Theory'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
