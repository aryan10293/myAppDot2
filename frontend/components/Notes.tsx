import React from 'react'
import { useNavigate } from 'react-router-dom';
import SmallCard from './SmallCard';




function Notes() {

    const navigate = useNavigate();
      const proofVault =  [
        { id: "p1", url: null, label: "Photo 1" },
        { id: "p2", url: null, label: "Log 2" },
        { id: "p3", url: null, label: "Note" },
    ];
      const reflections = [
        { id: "r1", text: "Felt good today — kept it small.", date: "2025-11-06" },
        { id: "r2", text: "Struggled but repaired quickly.", date: "2025-11-03" },
    ];
  return (
     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <SmallCard>
                    <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Proof vault</h3>
                    <button className="text-xs text-indigo-600 hover:underline" onClick={() => navigate("/vault")}>Open</button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                    {proofVault.slice(0, 6).map((p) => (
                        <div key={p.id} className="h-20 bg-gray-100 rounded-md overflow-hidden flex items-center justify-center text-xs text-gray-500">
                        {p.url ? <img src={p.url} alt={p.label} className="object-cover w-full h-full" /> : <span>{p.label}</span>}
                        </div>
                    ))}
                    </div>
              </SmallCard>

              <SmallCard>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-semibold text-gray-900">Reflections</h3>
                  <button className="text-xs text-indigo-600 hover:underline" onClick={() => navigate("/reflections")}>All</button>
                </div>

                <div className="space-y-3">
                  {reflections.slice(0, 3).map((r) => (
                    <div key={r.id} className="text-sm">
                      <div className="text-xs text-gray-500">{new Date(r.date).toLocaleDateString()}</div>
                      <div className="mt-1 text-sm text-gray-700">{r.text}</div>
                    </div>
                  ))}
                </div>
              </SmallCard>
            </div>
  )
}

export default Notes
