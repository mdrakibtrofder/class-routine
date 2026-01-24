import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { FilterState, Day } from '@/types/routine';
import { departments, courses, teachers, rooms, days } from '@/data/routineData';
import { Filter, X, Building2, BookOpen, User, MapPin, Calendar } from 'lucide-react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | null) => void;
  onClearFilters: () => void;
}

export const FilterBar = ({ filters, onFilterChange, onClearFilters }: FilterBarProps) => {
  const hasActiveFilters = Object.values(filters).some(v => v !== null);

  return (
    <div className="glass-card rounded-2xl p-6 shadow-card animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Filter Routine</h3>
          <p className="text-xs text-muted-foreground">Select criteria to highlight classes</p>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* Department */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Building2 className="w-3 h-3" /> Department
          </label>
          <Select
            value={filters.department || ''}
            onValueChange={(v) => onFilterChange('department', v || null)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Depts" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map(dept => (
                <SelectItem key={dept.code} value={dept.code}>
                  {dept.code} - {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Course */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Course
          </label>
          <Select
            value={filters.courseCode || ''}
            onValueChange={(v) => onFilterChange('courseCode', v || null)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Courses" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Courses</SelectItem>
              {courses.map(course => (
                <SelectItem key={course.code} value={course.code}>
                  {course.code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Teacher */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" /> Teacher
          </label>
          <Select
            value={filters.teacherCode || ''}
            onValueChange={(v) => onFilterChange('teacherCode', v || null)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Teachers" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Teachers</SelectItem>
              {teachers.map(teacher => (
                <SelectItem key={teacher.code} value={teacher.code}>
                  {teacher.code} - {teacher.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Room */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <MapPin className="w-3 h-3" /> Room
          </label>
          <Select
            value={filters.roomNo || ''}
            onValueChange={(v) => onFilterChange('roomNo', v || null)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Rooms" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Rooms</SelectItem>
              {rooms.map(room => (
                <SelectItem key={room} value={room}>
                  Room {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Day */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
            <Calendar className="w-3 h-3" /> Day
          </label>
          <Select
            value={filters.day || ''}
            onValueChange={(v) => onFilterChange('day', v as Day || null)}
          >
            <SelectTrigger className="w-full bg-background">
              <SelectValue placeholder="All Days" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border">
              <SelectItem value="all">All Days</SelectItem>
              {days.map(day => (
                <SelectItem key={day} value={day}>
                  {day === 'SUN' ? 'Sunday' : 
                   day === 'MON' ? 'Monday' :
                   day === 'TUE' ? 'Tuesday' :
                   day === 'WED' ? 'Wednesday' : 'Thursday'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
