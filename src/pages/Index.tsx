import { useState } from 'react';
import { FilterState } from '@/types/routine';
import { Header } from '@/components/routine/Header';
import { FilterBar } from '@/components/routine/FilterBar';
import { RoutineTable } from '@/components/routine/RoutineTable';
import { CourseList } from '@/components/routine/CourseList';

const Index = () => {
  const [filters, setFilters] = useState<FilterState>({
    department: null,
    courseCode: null,
    teacherCode: null,
    roomNo: null,
    day: null,
  });

  const handleFilterChange = (key: keyof FilterState, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === 'all' ? null : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      department: null,
      courseCode: null,
      teacherCode: null,
      roomNo: null,
      day: null,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <Header />

        {/* Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Routine Table */}
        <RoutineTable filters={filters} />

        {/* Course List */}
        <CourseList />

        {/* Footer */}
        <footer className="text-center py-6 text-sm text-muted-foreground">
          <p>© 2026 BAUST - Department of CSE. Interactive Class Routine Viewer.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
