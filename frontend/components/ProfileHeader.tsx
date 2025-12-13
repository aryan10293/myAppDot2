import React, {  } from 'react'
import StatCard from './StatCard';
import { useNavigate } from "react-router-dom";
import ProgressRing from './ProgressRing';
import { useQuery } from "@tanstack/react-query";
import useGoals from '../customHook/goals';
import useUser from '../customHook/user';
function ProfileHeader(): React.JSX.Element {
    const navigate = useNavigate();
    const { data: goals, isLoading } = useGoals();
    const { data: user } = useUser();
    const loginUser = user?.user || user || {};


  const { data:idk } = useQuery({
    queryKey: ['idk'],
    queryFn: async () => {
      const response = await fetch("http://localhost:2050/checkforcheckin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      return  response.json()
    }
  })



    if (isLoading) {
      return <span>Loading...</span>
    }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col sm:flex-row gap-6 items-center">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {false ?(
                  <img src={loginUser.avatarUrl} alt={`${loginUser.firstname} avatar`} className="h-28 w-28 rounded-full object-cover" />
                ) : (
                  <div className="h-28 w-28 rounded-full bg-indigo-100 flex items-center justify-center text-2xl font-bold text-indigo-700">
                    {loginUser.firstname?.[0] ?? "U"}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold text-gray-900">
                      {loginUser.firstname } {loginUser.lastname}
                      
                    </div>
                            {/* czn enter a a member since date if you want later  */}
                    <div className="text-sm text-gray-500">Member since { "2025"}</div>
                  </div>

                  <div className="flex gap-3">
                            {/* add soemthing in database that keep track fo streak */}
                    <StatCard label="Current streak" value={loginUser.streak} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-6">
                  <div className="flex items-center gap-4">
                    <ProgressRing percent={Math.min(Math.max( .40), 1)} />
                    <div className="text-sm text-gray-600">
                      <div className="font-medium text-gray-900">Weekly progress</div>
                      <div className="text-xs mt-1">Small wins stacked this week</div>
                    </div>
                  </div>

                  <div className="hidden md:block border-l h-12" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-700 font-medium">Top goals</div>
                    <ul className="mt-2 space-y-2">
                      {goals.slice(0, 3).map((g) => (
                        <li key={g.id} className="flex items-center justify-between bg-white/50 rounded-md p-3 border border-gray-100">
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{g.goalname}</div>
                            <div className="text-xs text-gray-500">Streak: {g.streak ?? 0} days</div>
                          </div>
                          <div>
                            <button
                              className="text-xs px-2 py-1 bg-gray-100 rounded-md text-gray-700"
                              onClick={() => navigate(`/goal/${g.goalname}`)}
                            >
                              View
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ProfileHeader
