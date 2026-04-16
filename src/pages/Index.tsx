import { useState } from 'react';
import { FilterState } from '@/types/routine';
import { Header, ScheduleSelector } from '@/components/routine/Header';
import { FilterBar } from '@/components/routine/FilterBar';
import { RoutineTable } from '@/components/routine/RoutineTable';
import { CourseList } from '@/components/routine/CourseList';
import { AdminPanel } from '@/components/routine/AdminPanel';

const emptyFilters: FilterState = {
  departments: [], courseCodes: [], teacherCodes: [], roomNos: [], days: [],
  years: [], semesters: [], types: [], sections: [],
};

const Index = () => {
  const [filters, setFilters] = useState<FilterState>(emptyFilters);
  const [schedule, setSchedule] = useState<'ramadan' | 'default'>('default');
  const [adminOpen, setAdminOpen] = useState(false);

  const handleFilterChange = (key: keyof FilterState, values: string[]) => {
    setFilters(prev => ({ ...prev, [key]: values }));
  };

  const handleClearFilters = () => setFilters(emptyFilters);

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 space-y-8">
        <Header onOpenAdmin={() => setAdminOpen(true)} />
        <ScheduleSelector schedule={schedule} onScheduleChange={setSchedule} />
        <FilterBar filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
        <RoutineTable filters={filters} onClearFilters={handleClearFilters} schedule={schedule} />
        <CourseList filters={filters} />
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>© 2026 BAUST - Department of CSE. Interactive Class Routine Viewer.</p>
        </footer>
      </div>

      <AdminPanel open={adminOpen} onOpenChange={setAdminOpen} />
    </div>
  );
};

export default Index;
