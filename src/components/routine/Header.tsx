import { GraduationCap, Calendar } from 'lucide-react';

export const Header = () => {
  return (
    <header className="text-center space-y-4 animate-fade-in">
      <div className="flex items-center justify-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-lg animate-float">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
      </div>
      
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
          Bangladesh Army University of Science and Technology
        </h1>
        <h2 className="text-xl md:text-2xl font-display text-primary font-semibold">
          Department of Computer Science and Engineering
        </h2>
      </div>
      
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Calendar className="w-5 h-5" />
        <span className="text-lg">Individual Class Routine & Course Load</span>
        <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">
          Winter 2026
        </span>
      </div>

      <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-primary" />
          <span>Theory</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-gradient-secondary" />
          <span>Sessional/Lab</span>
        </div>
      </div>
    </header>
  );
};

// Schedule selector component placed between header and filter bar
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Moon, Clock } from 'lucide-react';

interface ScheduleSelectorProps {
  schedule: 'ramadan' | 'default';
  onScheduleChange: (value: 'ramadan' | 'default') => void;
}

export const ScheduleSelector = ({ schedule, onScheduleChange }: ScheduleSelectorProps) => {
  return (
    <div className="flex items-center justify-center gap-3 animate-fade-in">
      <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-xl px-4 py-2 shadow-sm">
        {schedule === 'ramadan' ? (
          <Moon className="w-4 h-4 text-accent" />
        ) : (
          <Clock className="w-4 h-4 text-primary" />
        )}
        <Select value={schedule} onValueChange={(v) => onScheduleChange(v as 'ramadan' | 'default')}>
          <SelectTrigger className="w-[220px] border-0 bg-transparent shadow-none focus:ring-0 h-8">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-popover border-border">
            <SelectItem value="ramadan">🌙 Ramadan Time Schedule</SelectItem>
            <SelectItem value="default">🕐 Default Time Schedule</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
