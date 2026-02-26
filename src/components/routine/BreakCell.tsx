import { Coffee } from 'lucide-react';

interface BreakCellProps {
  isRamadan?: boolean;
  breakLabel?: string;
}

const MosqueIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 3c-1.5 2-3 3.5-3 5.5a3 3 0 0 0 6 0C15 6.5 13.5 5 12 3Z" />
    <path d="M6 12H4v8h16v-8h-2" />
    <path d="M6 12V9a6 6 0 0 1 12 0v3" />
    <path d="M10 20v-4h4v4" />
    <path d="M2 20h20" />
    <path d="M12 1v2" />
  </svg>
);

export const BreakCell = ({ isRamadan = false, breakLabel }: BreakCellProps) => {
  return (
    <td className="bg-accent/30 border border-white p-0">
      <div className="flex flex-col items-center justify-center gap-2 h-full min-h-[90px] py-4 text-accent-foreground">
        <div className="w-10 h-10 rounded-full bg-accent/40 flex items-center justify-center animate-float">
          {isRamadan ? <MosqueIcon className="w-5 h-5" /> : <Coffee className="w-5 h-5" />}
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase">Break</span>
        {breakLabel && (
          <span className="text-[10px] text-accent-foreground/70 font-medium">{breakLabel}</span>
        )}
      </div>
    </td>
  );
};
