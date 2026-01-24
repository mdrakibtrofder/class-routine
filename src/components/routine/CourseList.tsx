import { courses } from '@/data/routineData';
import { BookOpen, FlaskConical, Clock, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';

export const CourseList = () => {
  const totalTheory = courses.reduce((sum, c) => sum + c.theoryHours, 0);
  const totalSessional = courses.reduce((sum, c) => sum + c.sessionalHours, 0);
  const totalCredits = courses.reduce((sum, c) => sum + c.creditHours, 0);

  return (
    <div className="glass-card rounded-2xl p-6 shadow-card animate-slide-up">
      <h3 className="text-lg font-display font-bold text-foreground mb-4 flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-primary" />
        Course Summary
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Course Code</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-muted-foreground">Title</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Theory</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Sessional</th>
              <th className="text-center py-3 px-4 text-sm font-semibold text-muted-foreground">Credits</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, idx) => (
              <tr 
                key={course.code}
                className={cn(
                  "border-b border-border/50 hover:bg-muted/30 transition-colors",
                  idx % 2 === 0 && "bg-muted/10"
                )}
              >
                <td className="py-3 px-4">
                  <span className={cn(
                    "font-semibold text-sm",
                    course.type === 'sessional' ? 'text-secondary' : 'text-primary'
                  )}>
                    {course.code}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    {course.type === 'sessional' 
                      ? <FlaskConical className="w-4 h-4 text-secondary" />
                      : <BookOpen className="w-4 h-4 text-primary" />
                    }
                    <span className="text-sm">{course.title}</span>
                  </div>
                </td>
                <td className="text-center py-3 px-4">
                  {course.theoryHours > 0 ? (
                    <span className="text-sm font-medium">{course.theoryHours}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="text-center py-3 px-4">
                  {course.sessionalHours > 0 ? (
                    <span className="text-sm font-medium text-secondary">{course.sessionalHours}</span>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </td>
                <td className="text-center py-3 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent/50 rounded-full text-sm font-semibold">
                    {course.creditHours}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-primary/5 font-semibold">
              <td colSpan={2} className="py-3 px-4 text-right text-sm text-primary">
                TOTAL
              </td>
              <td className="text-center py-3 px-4">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <Clock className="w-4 h-4 text-primary" />
                  {totalTheory}
                </div>
              </td>
              <td className="text-center py-3 px-4">
                <div className="flex items-center justify-center gap-1 text-sm text-secondary">
                  <FlaskConical className="w-4 h-4" />
                  {totalSessional}
                </div>
              </td>
              <td className="text-center py-3 px-4">
                <div className="flex items-center justify-center gap-1 text-sm">
                  <CreditCard className="w-4 h-4 text-accent-foreground" />
                  <span className="px-2 py-0.5 bg-accent rounded-full">{totalCredits}</span>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
