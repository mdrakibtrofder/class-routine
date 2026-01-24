import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomBadgeProps {
  roomNo: string;
  compact?: boolean;
}

export const RoomBadge = ({ roomNo, compact }: RoomBadgeProps) => {
  if (compact) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium',
        'bg-orange-500 text-white group-hover:bg-white/20'
      )}>
        <MapPin className="w-2.5 h-2.5" />
        {roomNo}
      </span>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border',
      'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 border-slate-300'
    )}>
      <MapPin className="w-4 h-4" />
      <span className="font-semibold">Room {roomNo}</span>
    </div>
  );
};
