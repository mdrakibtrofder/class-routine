import { useState } from 'react';
import { ClassSession, FilterState } from '@/types/routine';
import { classSessions, timeSlots, days } from '@/data/routineData';
import { RoutineCell } from './RoutineCell';
import { BreakCell } from './BreakCell';
import { CourseDetailModal } from './CourseDetailModal';
import { cn } from '@/lib/utils';

interface RoutineTableProps {
  filters: FilterState;
}

const dayLabels: Record<string, string> = {
  SUN: 'Sunday',
  MON: 'Monday',
  TUE: 'Tuesday',
  WED: 'Wednesday',
  THU: 'Thursday',
};

export const RoutineTable = ({ filters }: RoutineTableProps) => {
  const [selectedSession, setSelectedSession] = useState<ClassSession | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    // Check if this slot is covered by a previous session's colspan
    for (let i = 0; i < slotIndex; i++) {
      const prevSession = getSessionForSlot(day, timeSlots[i].id);
      if (prevSession?.colSpan && i + prevSession.colSpan > slotIndex) {
        return true;
      }
    }
    return false;
  };

  const isHighlighted = (session: ClassSession): boolean => {
    if (!Object.values(filters).some(v => v !== null)) return false;

    const matchesDept = !filters.department || session.department === filters.department;
    const matchesCourse = !filters.courseCode || session.courseCode === filters.courseCode;
    const matchesTeacher = !filters.teacherCode || session.teacherCodes.includes(filters.teacherCode);
    const matchesRoom = !filters.roomNo || session.roomNo === filters.roomNo;
    const matchesDay = !filters.day || session.day === filters.day;

    return matchesDept && matchesCourse && matchesTeacher && matchesRoom && matchesDay;
  };

  const handleCellClick = (session: ClassSession) => {
    setSelectedSession(session);
    setModalOpen(true);
  };

  // Break column is between slot 3 and slot 4 (index 3)
  const breakAfterSlot = 2; // After 10:00-10:50

  return (
    <>
      <div className="overflow-x-auto animate-slide-up">
        <div className="glass-card rounded-2xl shadow-card overflow-hidden min-w-[1200px]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="time-header w-24 rounded-tl-2xl">Day</th>
                {timeSlots.slice(0, 3).map((slot, idx) => (
                  <th key={slot.id} className="time-header">
                    {slot.label}
                  </th>
                ))}
                <th className="time-header bg-accent text-accent-foreground w-16">
                  Break
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
                        onClick={() => session && handleCellClick(session)}
                        colSpan={session?.colSpan}
                      />
                    );
                  })}
                  
                  {/* Break cell - only render on first row */}
                  {dayIndex === 0 && <BreakCell />}
                  
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
                        onClick={() => session && handleCellClick(session)}
                        colSpan={session?.colSpan}
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
