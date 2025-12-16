import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';
import StatCardTwo  from '../components/StatCardTWo';
import ProgressReflection from '../components/ProgressReflection';
import useOneGoal from '../customHook/getOneGoal';
import History from '../components/History';
import useTags from '../customHook/useTags';
import useCheckins from '../customHook/useCheckins';

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
  
  const { data: goal, isLoading, refetch } = useOneGoal(goalname || '');
  const {  refetch: refetchCheckins } = useCheckins(goalname || '');
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
      refetchCheckins();
    }
  };

  if (isLoading) return <Loading overlay message="Loading goal..." />;

  const g = goal?.goal || goal || {};
  const currentStreak = g.streak;
  const longestStreak = g?.longeststreak ?? 0;
  const totalCompletions = g?.totalcheckins ?? 0;

  const lastCheckin = g?.lastcheckindate ? new Date(g.lastcheckindate).toLocaleDateString() : 'Never';
  const createdDate = g?.createdAt ? new Date(g.createdAt).toLocaleDateString() : 'Unknown';


  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/editgoals')}
              className="text-indigo-600 hover:underline text-sm text-left"
            >
              ← Back to goals
            </button>

            <button
              onClick={() => navigate('/profile')}
              className="text-indigo-600 hover:underline text-sm text-left"
            >
              ← Back to profile
            </button>
          </div>

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
        <ProgressReflection goalName={g.urlname} />

        {/* Recent activity */}
        {/* insert the activity of the data here */}
       <History goalName={g.urlname} />
      </main>
    </div>
  );
}

/* Stat Card Component */

