import { useState, useEffect } from 'react';
import { ClassSession, FilterState } from '@/types/routine';
import { classSessions, timeSlots, days } from '@/data/routineData';
import { RoutineCell } from './RoutineCell';
import { BreakCell } from './BreakCell';
import { CourseDetailModal } from './CourseDetailModal';
import { FilterNotification } from './FilterNotification';
import { cn } from '@/lib/utils';

interface RoutineTableProps {
  filters: FilterState;
  onClearFilters: () => void;
}

const dayLabels: Record<string, string> = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
};

const getCurrentDayCode = (): string => {
  const dayMap: Record<number, string> = {
    0: 'SUN',
    1: 'MON',
    2: 'TUE',
    3: 'WED',
    4: 'THU',
  };
  return dayMap[new Date().getDay()] || '';
};

const parseTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const getCurrentTimeSlotId = (): string | null => {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  for (const slot of timeSlots) {
    const slotStart = parseTimeToMinutes(slot.start);
    const slotEnd = parseTimeToMinutes(slot.end);
    
    if (currentMinutes >= slotStart && currentMinutes <= slotEnd) {
      return slot.id;
    }
  }
  return null;
};

export const RoutineTable = ({ filters, onClearFilters }: RoutineTableProps) => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTimeSlotId, setCurrentTimeSlotId] = useState<string | null>(null);
  const [currentDay, setCurrentDay] = useState<string>('');

  const hasActiveFilters = Object.values(filters).some(v => v !== null);

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTimeSlotId(getCurrentTimeSlotId());
      setCurrentDay(getCurrentDayCode());
    };
    
    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000);
    
    return () => clearInterval(interval);
  }, []);

  const getSessionForSlot = (day: string, slotId: string): ClassSession | null => {
    const slot = timeSlots.find(s => s.id === slotId);
    if (!slot) return null;

    return classSessions.find(session => {
      if (session.day !== day) return false;
      const sessionStart = session.startTime;
      return sessionStart === slot.start;
    }) || null;
  };

  const isSlotCoveredBySpan = (day: string, slotIndex: number): boolean => {
    for (let i = 0; i < slotIndex; i++) {
      const prevSession = getSessionForSlot(day, timeSlots[i].id);
      if (prevSession?.colSpan && i + prevSession.colSpan > slotIndex) {
        return true;
      }
    }
    return false;
  };

  const isFiltered = (session: ClassSession): boolean => {
    if (!hasActiveFilters) return true;

    const matchesDept = !filters.department || session.department === filters.department;
    const matchesCourse = !filters.courseCode || session.courseCode === filters.courseCode;
    const matchesTeacher = !filters.teacherCode || session.teacherCodes.includes(filters.teacherCode);
    const matchesRoom = !filters.roomNo || session.roomNo === filters.roomNo;
    const matchesDay = !filters.day || session.day === filters.day;

    return matchesDept && matchesCourse && matchesTeacher && matchesRoom && matchesDay;
  };

  const isHighlighted = (session: ClassSession): boolean => {
    if (!hasActiveFilters) return false;
    return isFiltered(session);
  };

  const isCurrentTimeSlot = (day: string, slotId: string): boolean => {
    return day === currentDay && slotId === currentTimeSlotId;
  };

  const handleCellClick = (session: ClassSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  return (
    <>
      {hasActiveFilters && (
        <FilterNotification onClearFilters={onClearFilters} />
      )}
      
      <div className="overflow-x-auto animate-slide-up">
        <div className="glass-card rounded-2xl shadow-card overflow-hidden min-w-[1200px]">
          <table className="w-full border-collapse border-spacing-2" style={{ borderSpacing: '8px' }}>
            <thead>
              <tr>
                <th className="time-header w-24 rounded-tl-2xl">Day</th>
                {timeSlots.slice(0, 3).map((slot) => (
                  <th key={slot.id} className="time-header">
                    {slot.label}
                  </th>
                ))}
                <th className="time-header bg-accent text-accent-foreground w-28">
                  <div className="flex flex-col">
                    <span className="text-xs">10.50 AM</span>
                    <span className="text-xs">11.30 AM</span>
                  </div>
                </th>
                {timeSlots.slice(3).map((slot, idx) => (
                  <th 
                    key={slot.id} 
                    className={cn("time-header", idx === timeSlots.length - 4 && "rounded-tr-2xl")}
                  >
                    {slot.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day, dayIndex) => (
                <tr key={day} className="group">
                  <td className={cn(
                    "day-header text-sm",
                    dayIndex === days.length - 1 && "rounded-bl-2xl"
                  )}>
                    <div className="flex flex-col items-center">
                      <span className="text-lg font-bold">{day}</span>
                      <span className="text-xs opacity-70">{dayLabels[day]}</span>
                    </div>
                  </td>
                  
                  {/* First 3 time slots */}
                  {timeSlots.slice(0, 3).map((slot, slotIndex) => {
                    if (isSlotCoveredBySpan(day, slotIndex)) return null;
                    
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
                  
                  {/* Break cell for each day */}
                  <BreakCell />
                  
                  {/* Remaining time slots */}
                  {timeSlots.slice(3).map((slot, slotIndex) => {
                    const actualIndex = slotIndex + 3;
                    if (isSlotCoveredBySpan(day, actualIndex)) return null;
                    
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

      <CourseDetailModal
        session={selectedSession}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  );
};
