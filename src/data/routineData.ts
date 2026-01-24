import { Course, Teacher, Department, ClassSession, TimeSlot, Day } from '@/types/routine';

export const courses: Course[] = [
  {
    code: 'CSE 2124',
    title: 'Introduction to Computer Programming Sessional',
    theoryHours: 0,
    sessionalHours: 1.5,
    creditHours: 3.0,
    type: 'sessional',
  },
  {
    code: 'CSE 1204',
    title: 'Object Oriented Programming Language I Sessional',
    theoryHours: 0,
    sessionalHours: 3.0,
    creditHours: 6.0,
    type: 'sessional',
  },
  {
    code: 'CSE 2123',
    title: 'Introduction to Computer Programming',
    theoryHours: 3.0,
    sessionalHours: 0,
    creditHours: 3.0,
    type: 'theory',
  },
  {
    code: 'CSE 4215',
    title: 'Professional Issues and Ethics in Computer Science',
    theoryHours: 2.0,
    sessionalHours: 0,
    creditHours: 2.0,
    type: 'theory',
  },
  {
    code: 'CSE 2110',
    title: 'Computer Programming Sessional',
    theoryHours: 0,
    sessionalHours: 1.5,
    creditHours: 3.0,
    type: 'sessional',
  },
];

export const teachers: Teacher[] = [
  {
    code: 'MRT',
    name: 'Md. Rakib Trofder',
    designation: 'Lecturer',
    department: 'CSE',
  },
  {
    code: 'RA',
    name: 'Ruhul Amin',
    designation: 'Lecturer',
    department: 'CSE',
  },
];

export const departments: Department[] = [
  { code: 'CSE', name: 'CSE', fullName: 'Computer Science and Engineering' },
  { code: 'CE', name: 'CE', fullName: 'Civil Engineering' },
  { code: 'BBA', name: 'BBA', fullName: 'Bachelor of Business Administration' },
  { code: 'English', name: 'English', fullName: 'Department of English' },
];

export const timeSlots: TimeSlot[] = [
  { id: '1', start: '08:00', end: '08:50', label: '08.00-08.50' },
  { id: '2', start: '09:00', end: '09:50', label: '09.00-09.50' },
  { id: '3', start: '10:00', end: '10:50', label: '10.00-10.50' },
  { id: '4', start: '11:30', end: '12:20', label: '11.30-12.20' },
  { id: '5', start: '12:30', end: '01:20', label: '12.30-01.20' },
  { id: '6', start: '01:30', end: '02:20', label: '01.30-02.20' },
  { id: '7', start: '02:30', end: '03:20', label: '02.30-03.20' },
  { id: '8', start: '03:30', end: '04:20', label: '03.30-04.20' },
  { id: '9', start: '04:30', end: '05:20', label: '04.30-05.20' },
];

export const days: Day[] = ['SUN', 'MON', 'TUE', 'WED', 'THU'];

export const classSessions: ClassSession[] = [
  {
    id: '1',
    courseCode: 'CSE 2124',
    teacherCodes: ['MRT'],
    roomNo: '210',
    department: 'CE',
    year: 2,
    semester: 1,
    day: 'SUN',
    startTime: '11:30',
    endTime: '02:20',
    colSpan: 3,
  },
  {
    id: '2',
    courseCode: 'CSE 2123',
    teacherCodes: ['MRT'],
    roomNo: '014',
    department: 'CE',
    year: 2,
    semester: 1,
    day: 'MON',
    startTime: '08:00',
    endTime: '08:50',
  },
  {
    id: '3',
    courseCode: 'CSE 4215',
    teacherCodes: ['MRT'],
    roomNo: '407',
    department: 'CSE',
    year: 4,
    semester: 2,
    section: 'A',
    day: 'TUE',
    startTime: '08:00',
    endTime: '08:50',
  },
  {
    id: '4',
    courseCode: 'CSE 2110',
    teacherCodes: ['RA', 'MRT'],
    roomNo: '302',
    department: 'English',
    year: 2,
    semester: 1,
    section: 'A',
    day: 'TUE',
    startTime: '02:30',
    endTime: '05:20',
    colSpan: 3,
  },
  {
    id: '5',
    courseCode: 'CSE 2123',
    teacherCodes: ['MRT'],
    roomNo: '014',
    department: 'CE',
    year: 2,
    semester: 1,
    day: 'WED',
    startTime: '08:00',
    endTime: '08:50',
  },
  {
    id: '6',
    courseCode: 'CSE 1204',
    teacherCodes: ['RA', 'MRT'],
    roomNo: '311',
    department: 'BBA',
    year: 1,
    semester: 2,
    section: 'A',
    day: 'WED',
    startTime: '02:30',
    endTime: '05:20',
    colSpan: 3,
  },
  {
    id: '7',
    courseCode: 'CSE 2123',
    teacherCodes: ['MRT'],
    roomNo: '014',
    department: 'CE',
    year: 2,
    semester: 1,
    day: 'THU',
    startTime: '08:00',
    endTime: '08:50',
  },
  {
    id: '8',
    courseCode: 'CSE 4215',
    teacherCodes: ['MRT'],
    roomNo: '407',
    department: 'CSE',
    year: 4,
    semester: 2,
    section: 'A',
    day: 'THU',
    startTime: '10:00',
    endTime: '10:50',
  },
];

export const rooms = ['014', '210', '302', '311', '407'];

export const getTeacherByCode = (code: string): Teacher | undefined => {
  return teachers.find(t => t.code === code);
};

export const getCourseByCode = (code: string): Course | undefined => {
  return courses.find(c => c.code === code);
};

export const getDepartmentByCode = (code: string): Department | undefined => {
  return departments.find(d => d.code === code);
};
