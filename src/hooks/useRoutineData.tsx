import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Course, Teacher, Department, ClassSession, TimeSlot, Day } from '@/types/routine';
import {
  courses as defaultCourses,
  teachers as defaultTeachers,
  departments as defaultDepartments,
  classSessions as defaultClassSessions,
  defaultTimeSlots,
  ramadanTimeSlots,
  days as defaultDays,
  rooms as defaultRooms,
  defaultBreakLabel,
  ramadanBreakLabel,
} from '@/data/routineData';

interface RoutineDataContextType {
  courses: Course[];
  teachers: Teacher[];
  departments: Department[];
  classSessions: ClassSession[];
  rooms: string[];
  days: Day[];
  defaultTimeSlots: TimeSlot[];
  ramadanTimeSlots: TimeSlot[];
  defaultBreakLabel: string;
  ramadanBreakLabel: string;

  // CRUD
  setCourses: (c: Course[]) => void;
  setTeachers: (t: Teacher[]) => void;
  setDepartments: (d: Department[]) => void;
  setClassSessions: (s: ClassSession[]) => void;
  setRooms: (r: string[]) => void;

  // Helpers
  getCourseByCode: (code: string) => Course | undefined;
  getTeacherByCode: (code: string) => Teacher | undefined;
  getDepartmentByCode: (code: string) => Department | undefined;

  resetToDefaults: () => void;
}

const RoutineDataContext = createContext<RoutineDataContextType | null>(null);

const LS_KEY = 'routine-admin-data';

function loadFromLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed[key] ?? fallback;
  } catch {
    return fallback;
  }
}

function saveToLS(data: Record<string, unknown>) {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
    localStorage.setItem(LS_KEY, JSON.stringify({ ...existing, ...data }));
  } catch {}
}

export const RoutineDataProvider = ({ children }: { children: ReactNode }) => {
  const [courses, setCoursesState] = useState<Course[]>(() => loadFromLS('courses', defaultCourses));
  const [teachers, setTeachersState] = useState<Teacher[]>(() => loadFromLS('teachers', defaultTeachers));
  const [departments, setDepartmentsState] = useState<Department[]>(() => loadFromLS('departments', defaultDepartments));
  const [classSessions, setClassSessionsState] = useState<ClassSession[]>(() => loadFromLS('classSessions', defaultClassSessions));
  const [rooms, setRoomsState] = useState<string[]>(() => loadFromLS('rooms', defaultRooms));

  const setCourses = useCallback((c: Course[]) => { setCoursesState(c); saveToLS({ courses: c }); }, []);
  const setTeachers = useCallback((t: Teacher[]) => { setTeachersState(t); saveToLS({ teachers: t }); }, []);
  const setDepartments = useCallback((d: Department[]) => { setDepartmentsState(d); saveToLS({ departments: d }); }, []);
  const setClassSessions = useCallback((s: ClassSession[]) => { setClassSessionsState(s); saveToLS({ classSessions: s }); }, []);
  const setRooms = useCallback((r: string[]) => { setRoomsState(r); saveToLS({ rooms: r }); }, []);

  const getCourseByCode = useCallback((code: string) => courses.find(c => c.code === code), [courses]);
  const getTeacherByCode = useCallback((code: string) => teachers.find(t => t.code === code), [teachers]);
  const getDepartmentByCode = useCallback((code: string) => departments.find(d => d.code === code), [departments]);

  const resetToDefaults = useCallback(() => {
    setCourses(defaultCourses);
    setTeachers(defaultTeachers);
    setDepartments(defaultDepartments);
    setClassSessions(defaultClassSessions);
    setRooms(defaultRooms);
    localStorage.removeItem(LS_KEY);
  }, [setCourses, setTeachers, setDepartments, setClassSessions, setRooms]);

  return (
    <RoutineDataContext.Provider value={{
      courses, teachers, departments, classSessions, rooms,
      days: defaultDays,
      defaultTimeSlots, ramadanTimeSlots,
      defaultBreakLabel, ramadanBreakLabel,
      setCourses, setTeachers, setDepartments, setClassSessions, setRooms,
      getCourseByCode, getTeacherByCode, getDepartmentByCode,
      resetToDefaults,
    }}>
      {children}
    </RoutineDataContext.Provider>
  );
};

export const useRoutineData = () => {
  const ctx = useContext(RoutineDataContext);
  if (!ctx) throw new Error('useRoutineData must be used within RoutineDataProvider');
  return ctx;
};
