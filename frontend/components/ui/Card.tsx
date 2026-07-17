export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-slate-800/60 border border-slate-700 rounded-xl p-6 ${className}`}>
      {children}
    </div>
  );
}