import React from 'react'
import Loading from './Loading';
import useTags from '../customHook/useTags';
function History(goalName: {goalName: string}) {
    // create a hook thatll get all the data for the person goal and all refelction history to render here
    const { data: tags, isLoading } = useTags(goalName.goalName || '');
    
    if (isLoading) return <Loading overlay message="Loading Profile..." />;
    console.log(tags);
  return (
   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your reflections</h2>
        <div className="space-y-4">
          {tags.tags.map((r) => (
            <div key={r.id} className="rounded-lg border p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    {r.split("|")[0]}
                  </div>
                  <p className="text-sm leading-relaxed">{r.split("|")[1]}</p>
                </div>
                <button className="text-xs opacity-50 hover:opacity-100 transition"></button>
              </div>
            </div>
          ))}
        </div>
      </div>
  )
}

export default History
