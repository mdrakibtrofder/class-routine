import { Button } from '@/components/ui/button';
import { FilterState, Day } from '@/types/routine';
import { useRoutineData } from '@/hooks/useRoutineData';
import { Filter, X, Building2, BookOpen, User, MapPin, Calendar, GraduationCap, Hash, FlaskConical, Layers } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useMemo, useState } from 'react';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, values: string[]) => void;
  onClearFilters: () => void;
}

interface MultiSelectFilterProps {
  label: string;
  icon: React.ReactNode;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder: string;
}

const MultiSelectFilter = ({ label, icon, options, selected, onChange, placeholder }: MultiSelectFilterProps) => {
  const [search, setSearch] = useState('');
  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));

  const toggleValue = (val: string) => {
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  };

  const toggleAll = () => {
    onChange(selected.length === options.length ? [] : options.map(o => o.value));
  };

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">{icon} {label}</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-background text-left font-normal h-10 px-3">
            <span className="truncate text-sm">
              {selected.length === 0 ? placeholder : selected.length === options.length ? 'All' : `${selected.length} selected`}
            </span>
            <span className={cn("ml-1 text-xs rounded-full px-1.5 py-0.5 bg-primary/10 text-primary font-semibold", selected.length === 0 && "hidden")}>
              {selected.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2 bg-popover border-border" align="start">
          {options.length > 5 && (
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-2 py-1.5 text-sm border border-border rounded-md bg-background mb-2 outline-none focus:ring-1 focus:ring-primary"
            />
          )}
          <div className="flex items-center gap-2 px-2 py-1.5 border-b border-border mb-1">
            <Checkbox
              checked={selected.length === options.length && options.length > 0}
              onCheckedChange={toggleAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-xs font-medium cursor-pointer">Select All</label>
          </div>
          <div className="max-h-48 overflow-y-auto space-y-0.5">
            {filtered.map(opt => (
              <div key={opt.value} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted/50 cursor-pointer" onClick={() => toggleValue(opt.value)}>
                <Checkbox checked={selected.includes(opt.value)} />
                <span className="text-sm truncate">{opt.label}</span>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export const FilterBar = ({ filters, onFilterChange, onClearFilters }: FilterBarProps) => {
  const { departments, courses, teachers, rooms, days, classSessions } = useRoutineData();
  const hasActiveFilters = Object.values(filters).some(v => (v as string[]).length > 0);

  const yearOptions = useMemo(() => {
    const years = [...new Set(classSessions.map(s => s.year))].sort();
    return years.map(y => ({ value: String(y), label: `Year ${y}` }));
  }, [classSessions]);

  const semesterOptions = useMemo(() => {
    const semesters = [...new Set(classSessions.map(s => s.semester))].sort();
    return semesters.map(s => ({ value: String(s), label: `Semester ${s}` }));
  }, [classSessions]);

  const sectionOptions = useMemo(() => {
    const sections = [...new Set(classSessions.map(s => s.section).filter(Boolean))].sort();
    return sections.map(s => ({ value: s!, label: `Section ${s}` }));
  }, [classSessions]);

  const typeOptions = [
    { value: 'theory', label: 'Theory' },
    { value: 'sessional', label: 'Sessional/Lab' },
  ];

  const dayLabels: Record<string, string> = {
    SUN: 'Sunday', MON: 'Monday', TUE: 'Tuesday', WED: 'Wednesday', THU: 'Thursday',
  };

  return (
    <div className="glass-card rounded-2xl p-6 shadow-card animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">Filter Routine</h3>
          <p className="text-xs text-muted-foreground">Select multiple criteria to highlight classes</p>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters} className="ml-auto text-destructive hover:text-destructive hover:bg-destructive/10">
            <X className="w-4 h-4 mr-1" /> Clear All
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <MultiSelectFilter
          label="Department"
          icon={<Building2 className="w-3 h-3" />}
          options={departments.map(d => ({ value: d.code, label: `${d.code} - ${d.name}` }))}
          selected={filters.departments}
          onChange={v => onFilterChange('departments', v)}
          placeholder="All Depts"
        />
        <MultiSelectFilter
          label="Course"
          icon={<BookOpen className="w-3 h-3" />}
          options={courses.map(c => ({ value: c.code, label: `${c.code}` }))}
          selected={filters.courseCodes}
          onChange={v => onFilterChange('courseCodes', v)}
          placeholder="All Courses"
        />
        <MultiSelectFilter
          label="Teacher"
          icon={<User className="w-3 h-3" />}
          options={teachers.map(t => ({ value: t.code, label: `${t.code} - ${t.name}` }))}
          selected={filters.teacherCodes}
          onChange={v => onFilterChange('teacherCodes', v)}
          placeholder="All Teachers"
        />
        <MultiSelectFilter
          label="Room"
          icon={<MapPin className="w-3 h-3" />}
          options={rooms.map(r => ({ value: r, label: `Room ${r}` }))}
          selected={filters.roomNos}
          onChange={v => onFilterChange('roomNos', v)}
          placeholder="All Rooms"
        />
        <MultiSelectFilter
          label="Day"
          icon={<Calendar className="w-3 h-3" />}
          options={days.map(d => ({ value: d, label: dayLabels[d] || d }))}
          selected={filters.days}
          onChange={v => onFilterChange('days', v as Day[])}
          placeholder="All Days"
        />
        <MultiSelectFilter
          label="Year"
          icon={<GraduationCap className="w-3 h-3" />}
          options={yearOptions}
          selected={filters.years.map(String)}
          onChange={v => onFilterChange('years', v)}
          placeholder="All Years"
        />
        <MultiSelectFilter
          label="Semester"
          icon={<Hash className="w-3 h-3" />}
          options={semesterOptions}
          selected={filters.semesters.map(String)}
          onChange={v => onFilterChange('semesters', v)}
          placeholder="All Semesters"
        />
        <MultiSelectFilter
          label="Type"
          icon={<FlaskConical className="w-3 h-3" />}
          options={typeOptions}
          selected={filters.types}
          onChange={v => onFilterChange('types', v)}
          placeholder="All Types"
        />
        {sectionOptions.length > 0 && (
          <MultiSelectFilter
            label="Section"
            icon={<Layers className="w-3 h-3" />}
            options={sectionOptions}
            selected={filters.sections}
            onChange={v => onFilterChange('sections', v)}
            placeholder="All Sections"
          />
        )}
      </div>
    </div>
  );
};
