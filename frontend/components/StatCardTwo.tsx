function StatCardTwo({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent: 'indigo' | 'amber' | 'emerald' | 'sky';
}) {
  const bgMap = {
    indigo: 'bg-indigo-50',
    amber: 'bg-amber-50',
    emerald: 'bg-emerald-50',
    sky: 'bg-sky-50',
  };
  const textMap = {
    indigo: 'text-indigo-700',
    amber: 'text-amber-700',
    emerald: 'text-emerald-700',
    sky: 'text-sky-700',
  };

  return (
    <div className={`${bgMap[accent]} rounded-lg p-4 border border-gray-100`}>
      <div className={`text-xs font-medium ${textMap[accent]}`}>{label}</div>
      <div className="mt-2 text-xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

export default StatCardTwo;