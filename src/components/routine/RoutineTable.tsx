import { useState, useEffect, useMemo } from 'react';
import { ClassSession, FilterState } from '@/types/routine';
import { useRoutineData } from '@/hooks/useRoutineData';
import { RoutineCell } from './RoutineCell';
import { BreakCell } from './BreakCell';
import { CourseDetailModal } from './CourseDetailModal';
import { FilterNotification } from './FilterNotification';
import { cn } from '@/lib/utils';

interface RoutineTableProps {
  filters: FilterState;
  onClearFilters: () => void;
  schedule: 'ramadan' | 'default';
}

const dayLabels: Record<string, string> = {
  SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday',
};

const getCurrentDayCode = (): string => {
  const dayMap: Record<number, string> = { 0: 'SUN', 1: 'MON', 2: 'TUE', 3: 'WED', 4: 'THU' };
  return dayMap[new Date().getDay()] || '';
};

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

export const RoutineTable = ({ filters, onClearFilters, schedule }: RoutineTableProps) => {
  const { classSessions, defaultTimeSlots, ramadanTimeSlots, defaultBreakLabel, days, getCourseByCode } = useRoutineData();
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeSlotId, setCurrentTimeSlotId] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<string>('');

  const isRamadan = schedule === 'ramadan';
  const timeSlots = isRamadan ? ramadanTimeSlots : defaultTimeSlots;
  const showBreak = !isRamadan;
  const breakAfterIndex = 3;
  const breakLabel = defaultBreakLabel;

  const hasActiveFilters = Object.values(filters).some(v => (v as string[]).length > 0);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      let foundSlot: string | null = null;
      for (const slot of timeSlots) {
        const slotStart = parseTimeToMinutes(slot.start);
        const slotEnd = parseTimeToMinutes(slot.end);
        if (currentMinutes >= slotStart && currentMinutes <= slotEnd) {
          foundSlot = slot.id;
          break;
        }
      }
      setCurrentTimeSlotId(foundSlot);
      setCurrentDay(getCurrentDayCode());
    };
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    return () => clearInterval(interval);
  }, [timeSlots]);

  const isFiltered = (session: ClassSession): boolean => {
    if (!hasActiveFilters) return true;
    const course = getCourseByCode(session.courseCode);
    const f = filters;
    if (f.departments.length > 0 && !f.departments.includes(session.department)) return false;
    if (f.courseCodes.length > 0 && !f.courseCodes.includes(session.courseCode)) return false;
    if (f.teacherCodes.length > 0 && !f.teacherCodes.some(tc => session.teacherCodes.includes(tc))) return false;
    if (f.roomNos.length > 0 && !f.roomNos.includes(session.roomNo)) return false;
    if (f.days.length > 0 && !f.days.includes(session.day)) return false;
    if (f.years.length > 0 && !f.years.includes(String(session.year) as any)) return false;
    if (f.semesters.length > 0 && !f.semesters.includes(String(session.semester) as any)) return false;
    if (f.types.length > 0 && course && !f.types.includes(course.type)) return false;
    if (f.sections.length > 0 && session.section && !f.sections.includes(session.section)) return false;
    return true;
  };

  // Get ALL sessions for a given day+slot (multiple sessions can overlap)
  const getSessionsForSlot = (day: string, slotId: string): ClassSession[] => {
    const defSlot = defaultTimeSlots.find(s => s.id === slotId);
    if (!defSlot) return [];
    return classSessions.filter(session => session.day === day && session.startTime === defSlot.start);
  };

  // Check if a slot is covered by a previous session's colSpan
  // Returns the sessions that cover this slot from a previous start
  const getCoveringSessionsForSlot = (day: string, slotIndex: number, slotsSubset: typeof timeSlots): ClassSession[] => {
    const covering: ClassSession[] = [];
    for (let i = 0; i < slotIndex; i++) {
      const sessions = getSessionsForSlot(day, slotsSubset[i].id);
      for (const s of sessions) {
        if (s.colSpan && i + s.colSpan > slotIndex) {
          covering.push(s);
        }
      }
    }
    return covering;
  };

  const isHighlighted = (session: ClassSession): boolean => hasActiveFilters && isFiltered(session);
  const isCurrentTimeSlot = (day: string, slotId: string): boolean => day === currentDay && slotId === currentTimeSlotId;

  const handleCellClick = (session: ClassSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const slotsBeforeBreak = showBreak ? timeSlots.slice(0, breakAfterIndex) : timeSlots;
  const slotsAfterBreak = showBreak ? timeSlots.slice(breakAfterIndex) : [];

  // Render cells for a slot that may have multiple sessions (vertical stacking)
  const renderSlotCells = (day: string, slot: typeof timeSlots[0], slotIndex: number, slotsSubset: typeof timeSlots) => {
    const covering = getCoveringSessionsForSlot(day, slotIndex, slotsSubset);
    if (covering.length > 0) return null; // covered by colSpan

    const sessions = getSessionsForSlot(day, slot.id);

    if (sessions.length === 0) {
      return (
        <td
          key={`${day}-${slot.id}`}
          className={cn(
            "routine-cell routine-cell-empty border border-foreground/20",
            isCurrentTimeSlot(day, slot.id) && "border-t-2 border-t-destructive"
          )}
        />
      );
    }

    // Filter visible sessions
    const visibleSessions = hasActiveFilters ? sessions.filter(s => isFiltered(s)) : sessions;
    const hiddenCount = sessions.length - visibleSessions.length;

    if (visibleSessions.length === 0 && hasActiveFilters) {
      return (
        <td
          key={`${day}-${slot.id}`}
          colSpan={sessions[0]?.colSpan}
          className={cn(
            "routine-cell routine-cell-empty opacity-20 border border-foreground/20",
            isCurrentTimeSlot(day, slot.id) && "border-t-2 border-t-destructive"
          )}
        />
      );
    }

    if (visibleSessions.length === 1) {
      const session = visibleSessions[0];
      return (
        <RoutineCell
          key={`${day}-${slot.id}`}
          session={session}
          isHighlighted={isHighlighted(session)}
          isFiltered={isFiltered(session)}
          hasActiveFilters={hasActiveFilters}
          onClick={() => handleCellClick(session)}
          colSpan={session.colSpan}
          isCurrentTime={isCurrentTimeSlot(day, slot.id)}
        />
      );
    }

    // Multiple sessions - vertical stacking
    const maxColSpan = Math.max(...visibleSessions.map(s => s.colSpan || 1));
    return (
      <td
        key={`${day}-${slot.id}`}
        colSpan={maxColSpan}
        className={cn(
          "p-0 border border-foreground/20",
          isCurrentTimeSlot(day, slot.id) && "border-t-2 border-t-destructive"
        )}
      >
        <div className="flex flex-col divide-y divide-foreground/20">
          {visibleSessions.map((session) => (
            <RoutineCell
              key={session.id}
              session={session}
              isHighlighted={isHighlighted(session)}
              isFiltered={isFiltered(session)}
              hasActiveFilters={hasActiveFilters}
              onClick={() => handleCellClick(session)}
              isCurrentTime={false}
              isInStack={true}
            />
          ))}
        </div>
      </td>
    );
  };

  return (
    <>
      {hasActiveFilters && <FilterNotification onClearFilters={onClearFilters} />}
      
      <div className="overflow-x-auto animate-slide-up">
        <div className="glass-card rounded-2xl shadow-card overflow-hidden min-w-[1200px]">
          <table className="w-full border-collapse table-fixed" style={{ borderSpacing: '1px' }}>
            <thead>
              <tr>
                <th className="time-header w-24 rounded-tl-2xl border border-foreground/20">Day</th>
                {slotsBeforeBreak.map((slot) => (
                  <th key={slot.id} className="time-header border border-foreground/20">{slot.label}</th>
                ))}
                {showBreak && (
                  <th className="time-header bg-accent w-28 border border-foreground/20">
                    {breakLabel}
                  </th>
                )}
                {slotsAfterBreak.map((slot, idx) => (
                  <th key={slot.id} className={cn("time-header border border-foreground/20", idx === slotsAfterBreak.length - 1 && "rounded-tr-2xl")}>
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={day}>
                  <td className={cn("day-header text-sm border border-foreground/20", dayIndex === days.length - 1 && "rounded-bl-2xl")}>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{day}</span>
                      <span className="text-xs opacity-70">{dayLabels[day]}</span>
                    </div>
                  </td>
                  
                  {slotsBeforeBreak.map((slot, slotIndex) => renderSlotCells(day, slot, slotIndex, slotsBeforeBreak))}
                  
                  {showBreak && <BreakCell isRamadan={false} breakLabel={breakLabel} />}
                  
                  {slotsAfterBreak.map((slot, slotIndex) => renderSlotCells(day, slot, slotIndex, slotsAfterBreak))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CourseDetailModal session={selectedSession} open={modalOpen} onOpenChange={setModalOpen} />
    </>
  );
};
