import { Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilterNotificationProps {
  onClearFilters: () => void;
}

export const FilterNotification = ({ onClearFilters }: FilterNotificationProps) => {
  return (
    <div className="mb-4 p-4 bg-primary/10 border border-primary/30 rounded-xl flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Filter className="w-4 h-4 text-primary" />
        </div>
        <div>
          <p className="font-medium text-foreground">Filter Applied</p>
          <p className="text-sm text-muted-foreground">Clear all filters to show all courses again</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={onClearFilters}
        className="border-primary/30 text-primary hover:bg-primary/10"
      >
        <X className="w-4 h-4 mr-1" />
        Clear Filters
      </Button>
    </div>
  );
};
