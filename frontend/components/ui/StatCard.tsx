export function StatCard({
  icon,
  title,
  value,
  color = 'text-cyan-400',
}: {
  icon: string;
  title: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <p className="text-slate-400 text-xs mb-2">{title}</p>
      <p className={`text-3xl font-extrabold ${color}`}>{value}</p>
    </div>
  );
}