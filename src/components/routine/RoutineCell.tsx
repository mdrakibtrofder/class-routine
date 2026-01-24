import { cn } from '@/lib/utils';
import { ClassSession } from '@/types/routine';
import { getCourseByCode, getTeacherByCode } from '@/data/routineData';
import { DepartmentBadge } from './DepartmentBadge';
import { RoomBadge } from './RoomBadge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface RoutineCellProps {
  session: ClassSession | null;
  isHighlighted: boolean;
  onClick: () => void;
  colSpan?: number;
  isCurrentTime?: boolean;
}

export const RoutineCell = ({ session, isHighlighted, onClick, colSpan = 1, isCurrentTime }: RoutineCellProps) => {
  if (!session) {
    return (
      <td 
        className={cn(
          "routine-cell routine-cell-empty",
          isCurrentTime && "border-t-2 border-t-red-500"
        )}
        style={{ gridColumn: `span ${colSpan}` }}
      />
    );
  }

  const course = getCourseByCode(session.courseCode);
  const teacherNames = session.teacherCodes
    .map(code => getTeacherByCode(code)?.code)
    .filter(Boolean)
    .join(', ');

  const cellContent = (
    <td
      colSpan={colSpan}
      className={cn(
        'routine-cell cell-interactive group',
        isHighlighted && 'cell-highlighted ring-2 ring-primary ring-offset-2',
        isCurrentTime && 'border-t-2 border-t-red-500',
        course?.type === 'sessional' 
          ? 'bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/30' 
          : 'bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20',
        'hover:ring-2 hover:ring-primary/50 hover:ring-offset-1 transition-all duration-200'
      )}
      onClick={onClick}
    >
      {/* Course Code & Teacher */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className={cn(
          'font-bold text-sm',
          course?.type === 'sessional' ? 'text-secondary' : 'text-primary'
        )}>
          {session.courseCode}
        </span>
        <span className="text-xs text-muted-foreground font-medium bg-muted px-1.5 py-0.5 rounded">
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
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-accent/0 to-accent/0 group-hover:from-accent/5 group-hover:to-accent/10 transition-all duration-300 pointer-events-none" />
      
      {/* Type indicator */}
      <div className={cn(
        'absolute top-0 left-0 w-1 h-full rounded-l-lg',
        course?.type === 'sessional' ? 'bg-secondary' : 'bg-primary'
      )} />
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
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
