import { Coffee } from 'lucide-react';

export const BreakCell = () => {
  return (
    <td className="bg-accent/30 min-h-[90px] p-0 border border-accent/40" style={{ margin: '1px' }}>
      <div className="flex flex-col items-center justify-center gap-2 h-full py-4 text-accent-foreground">
        <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center animate-float">
          <Coffee className="w-5 h-5" />
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase">Break</span>
      </div>
    </td>
  );
};
