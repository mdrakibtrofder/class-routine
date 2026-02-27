import { useState } from 'react';
import { useRoutineData } from '@/hooks/useRoutineData';
import { Course, Teacher, Department, ClassSession, Day } from '@/types/routine';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, RotateCcw, BookOpen, Users, Building2, Calendar, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AdminPanel = ({ open, onOpenChange }: AdminPanelProps) => {
  const data = useRoutineData();
  const { toast } = useToast();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            Admin Panel
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-end mb-2">
          <Button variant="outline" size="sm" onClick={() => { data.resetToDefaults(); toast({ title: 'Reset complete', description: 'All data restored to defaults.' }); }} className="text-destructive border-destructive/30 hover:bg-destructive/10">
            <RotateCcw className="w-4 h-4 mr-1" /> Reset All
          </Button>
        </div>

        <Tabs defaultValue="sessions" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-4">
            <TabsTrigger value="sessions"><Calendar className="w-4 h-4 mr-1" /> Sessions</TabsTrigger>
            <TabsTrigger value="courses"><BookOpen className="w-4 h-4 mr-1" /> Courses</TabsTrigger>
            <TabsTrigger value="teachers"><Users className="w-4 h-4 mr-1" /> Teachers</TabsTrigger>
            <TabsTrigger value="departments"><Building2 className="w-4 h-4 mr-1" /> Depts</TabsTrigger>
          </TabsList>

          <TabsContent value="sessions">
            <SessionsTab />
          </TabsContent>
          <TabsContent value="courses">
            <CoursesTab />
          </TabsContent>
          <TabsContent value="teachers">
            <TeachersTab />
          </TabsContent>
          <TabsContent value="departments">
            <DepartmentsTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

/* ========== Sessions Tab ========== */
const SessionsTab = () => {
  const { classSessions, setClassSessions, courses, teachers, departments, rooms, days } = useRoutineData();
  const { toast } = useToast();
  const [editId, setEditId] = useState<string | null>(null);

  const defaultSession: Omit<ClassSession, 'id'> = {
    courseCode: courses[0]?.code || '',
    teacherCodes: [],
    roomNo: rooms[0] || '',
    department: departments[0]?.code || '',
    year: 1, semester: 1,
    day: 'SUN' as Day,
    startTime: '08:00', endTime: '08:50',
  };

  const addSession = () => {
    const newSession: ClassSession = { ...defaultSession, id: Date.now().toString() };
    setClassSessions([...classSessions, newSession]);
    setEditId(newSession.id);
  };

  const updateSession = (id: string, updates: Partial<ClassSession>) => {
    setClassSessions(classSessions.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSession = (id: string) => {
    setClassSessions(classSessions.filter(s => s.id !== id));
    toast({ title: 'Session deleted' });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{classSessions.length} class sessions</p>
        <Button size="sm" onClick={addSession}><Plus className="w-4 h-4 mr-1" /> Add Session</Button>
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {classSessions.map(session => (
          <div key={session.id} className="border border-border rounded-xl p-3 space-y-2 bg-muted/20">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{session.courseCode} — {session.day} {session.startTime}-{session.endTime}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => setEditId(editId === session.id ? null : session.id)}>
                  {editId === session.id ? 'Close' : 'Edit'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => deleteSession(session.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            {editId === session.id && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 pt-2 border-t border-border/50">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Course</label>
                  <Select value={session.courseCode} onValueChange={v => updateSession(session.id, { courseCode: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{courses.map(c => <SelectItem key={c.code} value={c.code}>{c.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Day</label>
                  <Select value={session.day} onValueChange={v => updateSession(session.id, { day: v as Day })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{days.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Start Time</label>
                  <Input className="h-8 text-xs" value={session.startTime} onChange={e => updateSession(session.id, { startTime: e.target.value })} placeholder="08:00" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">End Time</label>
                  <Input className="h-8 text-xs" value={session.endTime} onChange={e => updateSession(session.id, { endTime: e.target.value })} placeholder="08:50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Room</label>
                  <Input className="h-8 text-xs" value={session.roomNo} onChange={e => updateSession(session.id, { roomNo: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Department</label>
                  <Select value={session.department} onValueChange={v => updateSession(session.id, { department: v })}>
                    <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                    <SelectContent>{departments.map(d => <SelectItem key={d.code} value={d.code}>{d.code}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Year</label>
                  <Input className="h-8 text-xs" type="number" value={session.year} onChange={e => updateSession(session.id, { year: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Semester</label>
                  <Input className="h-8 text-xs" type="number" value={session.semester} onChange={e => updateSession(session.id, { semester: parseInt(e.target.value) || 1 })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Section</label>
                  <Input className="h-8 text-xs" value={session.section || ''} onChange={e => updateSession(session.id, { section: e.target.value || undefined })} placeholder="A/B" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Teacher Codes (comma)</label>
                  <Input className="h-8 text-xs" value={session.teacherCodes.join(', ')} onChange={e => updateSession(session.id, { teacherCodes: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} />
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">Col Span</label>
                  <Input className="h-8 text-xs" type="number" value={session.colSpan || 1} onChange={e => { const v = parseInt(e.target.value); updateSession(session.id, { colSpan: v > 1 ? v : undefined }); }} />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Courses Tab ========== */
const CoursesTab = () => {
  const { courses, setCourses } = useRoutineData();
  const { toast } = useToast();

  const addCourse = () => {
    const newCourse: Course = {
      code: 'CSE XXXX',
      title: 'New Course',
      theoryHours: 3, sessionalHours: 0, creditHours: 3,
      type: 'theory',
    };
    setCourses([...courses, newCourse]);
  };

  const updateCourse = (idx: number, updates: Partial<Course>) => {
    const updated = [...courses];
    updated[idx] = { ...updated[idx], ...updates };
    setCourses(updated);
  };

  const deleteCourse = (idx: number) => {
    setCourses(courses.filter((_, i) => i !== idx));
    toast({ title: 'Course deleted' });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{courses.length} courses</p>
        <Button size="sm" onClick={addCourse}><Plus className="w-4 h-4 mr-1" /> Add Course</Button>
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {courses.map((course, idx) => (
          <div key={idx} className="border border-border rounded-xl p-3 bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Code</label>
                <Input className="h-8 text-xs" value={course.code} onChange={e => updateCourse(idx, { code: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs text-muted-foreground">Title</label>
                <Input className="h-8 text-xs" value={course.title} onChange={e => updateCourse(idx, { title: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Type</label>
                <Select value={course.type} onValueChange={v => updateCourse(idx, { type: v as 'theory' | 'sessional' })}>
                  <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="theory">Theory</SelectItem>
                    <SelectItem value="sessional">Sessional</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Theory Hrs</label>
                <Input className="h-8 text-xs" type="number" step="0.5" value={course.theoryHours} onChange={e => updateCourse(idx, { theoryHours: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Lab Hrs</label>
                <Input className="h-8 text-xs" type="number" step="0.5" value={course.sessionalHours} onChange={e => updateCourse(idx, { sessionalHours: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Credits</label>
                <Input className="h-8 text-xs" type="number" step="0.5" value={course.creditHours} onChange={e => updateCourse(idx, { creditHours: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={() => deleteCourse(idx)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Teachers Tab ========== */
const TeachersTab = () => {
  const { teachers, setTeachers } = useRoutineData();
  const { toast } = useToast();

  const addTeacher = () => {
    setTeachers([...teachers, { code: 'XX', name: 'New Teacher', designation: 'Lecturer', department: 'CSE' }]);
  };

  const updateTeacher = (idx: number, updates: Partial<Teacher>) => {
    const updated = [...teachers];
    updated[idx] = { ...updated[idx], ...updates };
    setTeachers(updated);
  };

  const deleteTeacher = (idx: number) => {
    setTeachers(teachers.filter((_, i) => i !== idx));
    toast({ title: 'Teacher deleted' });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{teachers.length} teachers</p>
        <Button size="sm" onClick={addTeacher}><Plus className="w-4 h-4 mr-1" /> Add Teacher</Button>
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {teachers.map((teacher, idx) => (
          <div key={idx} className="border border-border rounded-xl p-3 bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Code</label>
                <Input className="h-8 text-xs" value={teacher.code} onChange={e => updateTeacher(idx, { code: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs text-muted-foreground">Name</label>
                <Input className="h-8 text-xs" value={teacher.name} onChange={e => updateTeacher(idx, { name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Designation</label>
                <Input className="h-8 text-xs" value={teacher.designation} onChange={e => updateTeacher(idx, { designation: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={() => deleteTeacher(idx)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== Departments Tab ========== */
const DepartmentsTab = () => {
  const { departments, setDepartments } = useRoutineData();
  const { toast } = useToast();

  const addDept = () => {
    setDepartments([...departments, { code: 'NEW', name: 'NEW', fullName: 'New Department' }]);
  };

  const updateDept = (idx: number, updates: Partial<Department>) => {
    const updated = [...departments];
    updated[idx] = { ...updated[idx], ...updates };
    setDepartments(updated);
  };

  const deleteDept = (idx: number) => {
    setDepartments(departments.filter((_, i) => i !== idx));
    toast({ title: 'Department deleted' });
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{departments.length} departments</p>
        <Button size="sm" onClick={addDept}><Plus className="w-4 h-4 mr-1" /> Add Department</Button>
      </div>
      <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
        {departments.map((dept, idx) => (
          <div key={idx} className="border border-border rounded-xl p-3 bg-muted/20">
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Code</label>
                <Input className="h-8 text-xs" value={dept.code} onChange={e => updateDept(idx, { code: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Short Name</label>
                <Input className="h-8 text-xs" value={dept.name} onChange={e => updateDept(idx, { name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Full Name</label>
                <Input className="h-8 text-xs" value={dept.fullName} onChange={e => updateDept(idx, { fullName: e.target.value })} />
              </div>
              <div className="flex items-end">
                <Button variant="ghost" size="sm" onClick={() => deleteDept(idx)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
