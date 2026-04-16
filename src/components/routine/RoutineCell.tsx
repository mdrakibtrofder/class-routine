import { cn } from '@/lib/utils';
import { ClassSession } from '@/types/routine';
import { useRoutineData } from '@/hooks/useRoutineData';
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
  isInStack?: boolean;
}

export const RoutineCell = ({ 
  session, 
  isHighlighted, 
  isFiltered,
  hasActiveFilters,
  onClick, 
  colSpan = 1, 
  isCurrentTime,
  isInStack = false,
}: RoutineCellProps) => {
  const { getCourseByCode, getTeacherByCode } = useRoutineData();

  if (!session) {
    if (isInStack) return null;
    return (
      <td 
        className={cn(
          "routine-cell routine-cell-empty border border-foreground/20",
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

  if (hasActiveFilters && !isFiltered) {
    if (isInStack) return null;
    return (
      <td 
        colSpan={colSpan}
        className={cn(
          "routine-cell routine-cell-empty opacity-20 border border-foreground/20",
          isCurrentTime && "border-t-2 border-t-destructive"
        )}
      />
    );
  }

  const Wrapper = isInStack ? 'div' : 'td';
  const wrapperProps = isInStack ? {} : { colSpan };

  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Wrapper
            {...wrapperProps}
            className={cn(
              'routine-cell cell-interactive cursor-pointer',
              'bg-muted/50',
              !isInStack && 'border border-foreground/20',
              'hover:bg-[#1891CF] hover:border-[#1891CF] [&:hover_*]:text-white',
              isHighlighted && 'cell-highlighted ring-2 ring-primary ring-offset-2',
              isCurrentTime && 'border-t-2 border-t-destructive'
            )}
            onClick={onClick}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex items-center gap-1.5">
                {isSessional ? (
                  <FlaskConical className="w-4 h-4 text-foreground" />
                ) : (
                  <BookOpen className="w-4 h-4 text-foreground" />
                )}
                <span className="font-bold text-sm text-foreground">
                  {session.courseCode}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium bg-blue-500 text-white px-1.5 py-0.5 rounded">
                  {teacherNames}
                </span>
                {session.isOddRoll && (
                  <span className="text-[10px] font-medium bg-purple-500 text-white px-1.5 py-0.5 rounded">
                    #ODD
                  </span>
                )}
              </div>
            </div>

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
          </Wrapper>
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
