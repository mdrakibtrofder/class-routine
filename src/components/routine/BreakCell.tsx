import { Coffee } from 'lucide-react';

export const BreakCell = () => {
  return (
    <td 
      rowSpan={5}
      className="break-cell bg-gradient-to-b from-accent/30 via-accent/20 to-accent/30 border border-accent/40"
    >
      <div className="flex flex-col items-center gap-2 text-accent-foreground">
        <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center animate-float">
          <Coffee className="w-5 h-5" />
        </div>
        <span className="text-sm font-semibold tracking-wider uppercase">Break</span>
      </div>
    </td>
  );
};
