import React from 'react'
import SmallCard from './SmallCard';

function Achievements() {
      const achievements = [
            { id: "a1", label: "7-day streak" },
            { id: "a2", label: "50 tiny wins" },
        ];

  return (
    <SmallCard>
         <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900">Achievements</h3>
            <span className="text-xs text-gray-500">{achievements.length} unlocked</span>
        </div>
        <div className="flex flex-wrap gap-2">
            {achievements.map((a) => (
                <div key={a.id} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs rounded-full border border-indigo-100">
                {a.label}
        </div>
    ))}
    </div>
    </SmallCard>
  )
}

export default Achievements
