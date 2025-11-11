import React from 'react'

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="bg-white/60 border border-gray-100 rounded-lg p-4 text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-2 text-2xl font-extrabold text-gray-900">{value}</div>
    </div>
  );
}

export default StatCard
