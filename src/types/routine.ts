export interface Course {
  code: string;
  title: string;
  theoryHours: number;
  sessionalHours: number;
  creditHours: number;
  type: 'theory' | 'sessional';
}

export interface Teacher {
  code: string;
  name: string;
  designation: string;
  department: string;
}

export interface Department {
  code: string;
  name: string;
  fullName: string;
}

export interface ClassSession {
  id: string;
  courseCode: string;
  teacherCodes: string[];
  roomNo: string;
  department: string;
  year: number;
  semester: number;
  section?: string;
  day: Day;
  startTime: string;
  endTime: string;
  colSpan?: number;
}

export type Day = 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU';

export interface TimeSlot {
  id: string;
  start: string;
  end: string;
  label: string;
}

export interface FilterState {
  department: string | null;
  courseCode: string | null;
  teacherCode: string | null;
  roomNo: string | null;
  day: Day | null;
}
