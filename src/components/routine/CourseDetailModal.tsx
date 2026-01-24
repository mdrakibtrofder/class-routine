import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ClassSession } from '@/types/routine';
import { getCourseByCode, getTeacherByCode } from '@/data/routineData';
import { DepartmentBadge } from './DepartmentBadge';
import { RoomBadge } from './RoomBadge';
import { YearBadge } from './YearBadge';
import { Clock, BookOpen, FlaskConical, Users, CreditCard } from 'lucide-react';

interface CourseDetailModalProps {
  session: ClassSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CourseDetailModal = ({ session, open, onOpenChange }: CourseDetailModalProps) => {
  if (!session) return null;

  const course = getCourseByCode(session.courseCode);
  const teachers = session.teacherCodes.map(code => getTeacherByCode(code)).filter(Boolean);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-card border-border shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              course?.type === 'sessional' 
                ? 'bg-gradient-secondary' 
                : 'bg-gradient-primary'
            }`}>
              {course?.type === 'sessional' 
                ? <FlaskConical className="w-6 h-6 text-white" />
                : <BookOpen className="w-6 h-6 text-white" />
              }
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{session.courseCode}</h2>
              <p className="text-sm text-muted-foreground font-normal">{course?.title}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Time & Day */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
            <Clock className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="font-semibold">
                {session.day} • {session.startTime} - {session.endTime}
              </p>
            </div>
          </div>

          {/* Teachers */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="w-4 h-4" /> Instructors
            </h4>
            <div className="space-y-2">
              {teachers.map(teacher => teacher && (
                <div key={teacher.code} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm">
                    {teacher.code}
                  </div>
                  <div>
                    <p className="font-medium">{teacher.name}</p>
                    <p className="text-xs text-muted-foreground">{teacher.designation}, {teacher.department}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Location</h4>
              <RoomBadge roomNo={session.roomNo} />
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-muted-foreground">Class</h4>
              <YearBadge 
                year={session.year} 
                semester={session.semester} 
                section={session.section} 
              />
            </div>
          </div>

          {/* Department */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-muted-foreground">Department</h4>
            <DepartmentBadge 
              department={session.department} 
              year={session.year} 
              semester={session.semester}
              section={session.section}
            />
          </div>

          {/* Course Stats */}
          {course && (
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="text-center p-3 rounded-xl bg-primary/10">
                <CreditCard className="w-5 h-5 mx-auto mb-1 text-primary" />
                <p className="text-xs text-muted-foreground">Credits</p>
                <p className="font-bold text-primary">{course.creditHours}</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-muted/50">
                <BookOpen className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Theory</p>
                <p className="font-bold">{course.theoryHours}h</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-secondary/10">
                <FlaskConical className="w-5 h-5 mx-auto mb-1 text-secondary" />
                <p className="text-xs text-muted-foreground">Lab</p>
                <p className="font-bold text-secondary">{course.sessionalHours}h</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
