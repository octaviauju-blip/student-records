type BadgeColor = 'green' | 'red' | 'yellow' | 'blue' | 'gray';

const colorMap: Record<BadgeColor, string> = {
  green: 'bg-green-500/15 text-green-400',
  red: 'bg-red-500/15 text-red-400',
  yellow: 'bg-yellow-500/15 text-yellow-400',
  blue: 'bg-cyan-500/15 text-cyan-400',
  gray: 'bg-slate-500/15 text-slate-300',
};

export function Badge({ children, color = 'gray' }: { children: React.ReactNode; color?: BadgeColor }) {
  return (
    <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${colorMap[color]}`}>
      {children}
    </span>
  );
}