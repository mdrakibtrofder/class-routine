import { MapPin, Monitor, FlaskConical, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RoomBadgeProps {
  roomNo: string;
  compact?: boolean;
}

const getRoomConfig = (roomNo: string) => {
  const num = parseInt(roomNo);
  
  // Labs typically in 300 series
  if (num >= 300 && num < 400) {
    return {
      icon: FlaskConical,
      label: 'Lab',
      className: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 border-emerald-300',
    };
  }
  
  // Large lecture halls in 400 series
  if (num >= 400) {
    return {
      icon: Users,
      label: 'Lecture Hall',
      className: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 border-amber-300',
    };
  }
  
  // Computer labs in 200 series
  if (num >= 200 && num < 300) {
    return {
      icon: Monitor,
      label: 'Computer Lab',
      className: 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-700 border-blue-300',
    };
  }
  
  // Default room
  return {
    icon: MapPin,
    label: 'Room',
    className: 'bg-gradient-to-r from-slate-500/20 to-gray-500/20 text-slate-700 border-slate-300',
  };
};

export const RoomBadge = ({ roomNo, compact }: RoomBadgeProps) => {
  const config = getRoomConfig(roomNo);
  const Icon = config.icon;

  if (compact) {
    return (
      <span className={cn(
        'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border',
        config.className
      )}>
        <Icon className="w-2.5 h-2.5" />
        {roomNo}
      </span>
    );
  }

  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border',
      config.className
    )}>
      <Icon className="w-4 h-4" />
      <div className="flex flex-col">
        <span className="text-xs opacity-70">{config.label}</span>
        <span className="font-semibold">Room {roomNo}</span>
      </div>
    </div>
  );
};
