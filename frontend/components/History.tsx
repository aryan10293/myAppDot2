import React from 'react'

function History() {
    const pastReflections: ReflectionData[] = [
    {
      id: '1',
      date: 'Dec 5, 2025',
      text: 'Great session today! Felt more energized than usual. Managed to go beyond the 5 minutes.',
      mood: 'great',
    },
    {
      id: '2',
      date: 'Dec 4, 2025',
      text: 'Completed the goal but felt a bit tired. Still kept it consistent though.',
      mood: 'good',
    },
    {
      id: '3',
      date: 'Dec 3, 2025',
      text: 'Struggled today but managed to repair and get back on track.',
      mood: 'okay',
    },
    {
      id: '4',
      date: 'Dec 2, 2025',
      text: 'Fantastic day! Feeling really good about the progress.',
      mood: 'great',
    },
  ];
  return (
   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your reflections</h2>
        <div className="space-y-4">
          {pastReflections.map((r) => (
            <div key={r.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="text-xs font-semibold uppercase tracking-wide">{r.mood}</div>
                    <span className="text-xs opacity-75">•</span>
                    <div className="text-xs font-medium opacity-75">{r.date}</div>
                  </div>
                  <p className="text-sm leading-relaxed">{r.text}</p>
                </div>
                <button className="text-xs opacity-50 hover:opacity-100 transition">✕</button>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default History
