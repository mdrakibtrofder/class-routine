import { useState, useEffect } from 'react';
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
  const { classSessions, defaultTimeSlots, ramadanTimeSlots, defaultBreakLabel, days } = useRoutineData();
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeSlotId, setCurrentTimeSlotId] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<string>('');

  const isRamadan = schedule === 'ramadan';
  const timeSlots = isRamadan ? ramadanTimeSlots : defaultTimeSlots;
  const showBreak = !isRamadan;
  const breakAfterIndex = 3; // default schedule only
  const breakLabel = defaultBreakLabel;

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

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

  const getSessionForSlot = (day: string, slotId: string): ClassSession | null => {
    const defSlot = defaultTimeSlots.find(s => s.id === slotId);
    if (!defSlot) return null;
    return classSessions.find(session => {
      if (session.day !== day) return false;
      return session.startTime === defSlot.start;
    }) || null;
  };

  const isSlotCoveredBySpan = (day: string, slotIndex: number, slotsSubset: typeof timeSlots): boolean => {
    for (let i = 0; i < slotIndex; i++) {
      const prevSession = getSessionForSlot(day, slotsSubset[i].id);
      if (prevSession?.colSpan && i + prevSession.colSpan > slotIndex) return true;
    }
    return false;
  };

  const isFiltered = (session: ClassSession): boolean => {
    if (!hasActiveFilters) return true;
    return (!filters.department || session.department === filters.department) &&
      (!filters.courseCode || session.courseCode === filters.courseCode) &&
      (!filters.teacherCode || session.teacherCodes.includes(filters.teacherCode)) &&
      (!filters.roomNo || session.roomNo === filters.roomNo) &&
      (!filters.day || session.day === filters.day);
  };

  const isHighlighted = (session: ClassSession): boolean => hasActiveFilters && isFiltered(session);
  const isCurrentTimeSlot = (day: string, slotId: string): boolean => day === currentDay && slotId === currentTimeSlotId;

  const handleCellClick = (session: ClassSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  const slotsBeforeBreak = showBreak ? timeSlots.slice(0, breakAfterIndex) : timeSlots;
  const slotsAfterBreak = showBreak ? timeSlots.slice(breakAfterIndex) : [];

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
                  
                  {slotsBeforeBreak.map((slot, slotIndex) => {
                    if (isSlotCoveredBySpan(day, slotIndex, slotsBeforeBreak)) return null;
                    const session = getSessionForSlot(day, slot.id);
                    return (
                      <RoutineCell
                        key={`${day}-${slot.id}`}
                        session={session}
                        isHighlighted={session ? isHighlighted(session) : false}
                        isFiltered={session ? isFiltered(session) : false}
                        hasActiveFilters={hasActiveFilters}
                        onClick={() => session && handleCellClick(session)}
                        colSpan={session?.colSpan}
                        isCurrentTime={isCurrentTimeSlot(day, slot.id)}
                      />
                    );
                  })}
                  
                  {showBreak && <BreakCell isRamadan={false} breakLabel={breakLabel} />}
                  
                  {slotsAfterBreak.map((slot, slotIndex) => {
                    if (isSlotCoveredBySpan(day, slotIndex, slotsAfterBreak)) return null;
                    const session = getSessionForSlot(day, slot.id);
                    return (
                      <RoutineCell
                        key={`${day}-${slot.id}`}
                        session={session}
                        isHighlighted={session ? isHighlighted(session) : false}
                        isFiltered={session ? isFiltered(session) : false}
                        hasActiveFilters={hasActiveFilters}
                        onClick={() => session && handleCellClick(session)}
                        colSpan={session?.colSpan}
                        isCurrentTime={isCurrentTimeSlot(day, slot.id)}
                      />
                    );
                  })}
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
