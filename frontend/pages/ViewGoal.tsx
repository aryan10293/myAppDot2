import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import StatCardTwo  from '../components/StatCardTWo';
import useOneGoal from '../customHook/getOneGoal';
import History from '../components/History';
import Reflection from '../components/Reflection';
import useTags from '../customHook/useTags';

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
// Checked in — stayed consistent for this day

export default function ViewGoal() {
  const { goalname } = useParams<{ goalname: string }>();
  const navigate = useNavigate();
  const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
  const { data: goal, isLoading, refetch } = useOneGoal(goalname || '');
  const { refetch: refetchTags } = useTags(goalname || '');
  // i need to update the data of the tags to reflect new checkin

  const handleCheckin = async () => {
    const response = await fetch(`http://localhost:2050/checkin/${goalname}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });

    const data = await response.json();
    console.log(data);
    if (data.status === '200') {
      alert('Check-in successful!');
      refetch();
      refetchTags();
    }
  };

  if (isLoading) return <Loading overlay message="Loading goal..." />;

  const g = goal?.goal || goal || {};
  const currentStreak = g.streak;
  console.log(currentStreak)
  const longestStreak = g?.longeststreak ?? 0;
  const totalCompletions = g?.totalcheckins ?? 0;
  const weekProgress = g?.weekProgress ?? [0, 0, 0, 0, 0, 0, 0];
  const monthProgress = g?.monthProgress ?? Array(30).fill(0);
  const lastCheckin = g?.lastcheckindate ? new Date(g.lastcheckindate).toLocaleDateString() : 'Never';
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
          <Reflection  goalName={g.goalname}/>
        </section>

        {/* Recent activity */}
        {/* insert the activity of the data here */}
       <History goalName={g.goalname} />
      </main>
    </div>
  );
}

/* Stat Card Component */

