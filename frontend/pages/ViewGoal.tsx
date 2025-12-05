import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import StatCardTwo  from '../components/StatCardTWo';
import useOneGoal from '../customHook/getOneGoal';

// interface GoalData {
//   id: string;
//   goalname: string;
//   description?: string;
//   frequency: string;
//   minutes: number;
//   privacy: string;
//   currentStreak: number;
//   longestStreak: number;
//   totalCompletions: number;
//   createdAt: string;
//   lastCheckinDate?: string;
//   weekProgress?: number[];
//   monthProgress?: number[];
// }

export default function ViewGoal() {
  const { goalname } = useParams<{ goalname: string }>();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const { data: goal, isLoading, refetch } = useOneGoal(goalname || '');
console.log(goal);

  const handleCheckin = async () => {
    const response = await fetch(`http://localhost:2050/checkin/${goalname}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();
    if (data.status === '200') {
      alert('Check-in successful!');
      refetch();
    }
  };

  if (isLoading) return <Loading overlay message="Loading goal..." />;

  const g = goal?.goal || goal || {};
  const currentStreak = g.streak;
  console.log(currentStreak)
  const longestStreak = g?.longestStreak ?? 0;
  const totalCompletions = g?.totalCompletions ?? 0;
  const weekProgress = g?.weekProgress ?? [0, 0, 0, 0, 0, 0, 0];
  const monthProgress = g?.monthProgress ?? Array(30).fill(0);
  const lastCheckin = g?.lastCheckinDate ? new Date(g.lastCheckinDate).toLocaleDateString() : 'Never';
  const createdDate = g?.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Unknown';

  const progressData = timeframe === 'week' ? weekProgress : monthProgress;
  const maxValue = Math.max(...progressData, 1);
  const daysLabel = timeframe === 'week' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] : [];

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <button onClick={() => navigate('/editgoals')} className="text-indigo-600 hover:underline text-sm">
            ← Back to goals
          </button>
          <div className="flex gap-3">
            <button onClick={() => navigate(`/editgoals`)} className="text-sm px-3 py-2 border rounded-md bg-white hover:bg-gray-50">
              Edit goal
            </button>
            <button
              onClick={handleCheckin}
              className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              ✓ Check-in today
            </button>
          </div>
        </header>

        {/* Goal overview */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm mb-6">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-gray-900">{g.goalname}</h1>
            <p className="mt-2 text-gray-600 max-w-2xl">{g.description || 'No description provided.'}</p>
            <div className="mt-3 flex flex-wrap gap-2 items-center text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-100 rounded-full">{g.frequency || 'daily'}</span>
              <span>{g.minutes} min per session</span>
              <span>•</span>
              <span>Privacy: {g.privacy}</span>
              <span>•</span>
              <span>Created {createdDate}</span>
            </div>
          </div>

          {/* Key stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <StatCardTwo label="Current Streak" value={`${currentStreak} days`} accent="indigo" />
            <StatCardTwo label="Longest Streak" value={`${longestStreak} days`} accent="amber" />
            <StatCardTwo label="Total Check-ins" value={totalCompletions} accent="emerald" />
            <StatCardTwo label="Last Check-in" value={lastCheckin} accent="sky" />
          </div>
        </section>

        {/* Progress visualization */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Weekly/monthly chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimeframe('week')}
                  className={`px-3 py-1 text-xs rounded-md ${timeframe === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Week
                </button>
                <button
                  onClick={() => setTimeframe('month')}
                  className={`px-3 py-1 text-xs rounded-md ${timeframe === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  Month
                </button>
              </div>
            </div>

            {/* Bar chart */}
            <div className="flex items-end gap-2 h-40 justify-between">
              {progressData.slice(0, timeframe === 'week' ? 7 : 30).map((value, i) => (
                <div key={i} className="flex flex-col items-center gap-2 flex-1 min-w-0">
                  <div className="w-full bg-gray-100 rounded-md overflow-hidden h-32 flex flex-col-reverse">
                    <div
                      className="bg-indigo-500 transition-all duration-200"
                      style={{ height: `${maxValue > 0 ? (value / maxValue) * 100 : 0}%` }}
                    />
                  </div>
                  {timeframe === 'week' && (
                    <label className="text-xs font-medium text-gray-500 text-center">{daysLabel[i]}</label>
                  )}
                  {timeframe === 'month' && i % 5 === 0 && (
                    <label className="text-xs font-medium text-gray-500">{i + 1}</label>
                  )}
                </div>
              ))}
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {timeframe === 'week' ? "This week's activity" : "This month's activity"}
            </p>
          </div>

          {/* Quick insights sidebar */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-100 p-6">
              <div className="text-sm font-semibold text-indigo-900">Consistency Rate</div>
              <div className="mt-2 text-3xl font-extrabold text-indigo-600">
                {totalCompletions > 0 ? Math.round((totalCompletions / (currentStreak + 5)) * 100) : 0}%
              </div>
              <p className="mt-2 text-xs text-indigo-700">Keep the momentum going!</p>
            </div>


            <button
              onClick={handleCheckin}
              className="w-full px-4 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 text-sm"
            >
              Check-in now
            </button>
          </div>
        </section>

        {/* Recent activity */}
        <section className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent activity</h2>
          <div className="space-y-3">
            {[
              { date: 'Dec 5, 2025', note: 'Check-in completed' },
              { date: 'Dec 4, 2025', note: 'Check-in completed' },
              { date: 'Dec 3, 2025', note: 'Missed' },
              { date: 'Dec 2, 2025', note: 'Check-in completed' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                <div className="text-xs text-gray-500 font-medium min-w-fit">{item.date}</div>
                <div className="text-sm text-gray-700">{item.note}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

/* Stat Card Component */

