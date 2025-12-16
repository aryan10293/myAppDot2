import React, { useState } from 'react'
import Reflection from './Reflection';
import useOneGoal from '../customHook/getOneGoal';
import useCheckins from '../customHook/useCheckins';
import getWeekRange from './getWeekRange';

function ProgressReflection(goalName: { goalName: string }) {
    const [timeframe, setTimeframe] = useState<'week' | 'month'>('week');
    const { data: goal, } = useOneGoal(goalName.goalName || '');
    const { data: checkins } = useCheckins(goalName.goalName || '');
    const {start, end} = getWeekRange();
    const g = goal?.goal || goal || {};
    const checkinsData = checkins?.checkInDates ?? [];
    const weekProgress = checkins?.currentWeekArray ?? [];
    const monthProgress = checkins?.currentMonthArray ?? [];
    //const weekProgress = g?.weekProgress ?? [0, 0, 0, 0, 0, 0, 0];

    const progressData = timeframe === 'week' ? weekProgress : monthProgress;
    const maxValue = Math.max(...progressData, 1);
    const daysLabel = timeframe === 'week' ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] : [];
    const week = () => {
        return <div className="text-xs text-gray-500">Week of <span className="font-medium text-gray-700">{`${start}`.split(' ')[1]} {`${start}`.split(' ')[2]} → {`${end}`.split(' ')[1]} {`${end}`.split(' ')[2]}</span></div>
    }
    const month = () => {
        return <div className="text-xs text-gray-500">Month of <span className="font-medium text-gray-700">{`${start}`.split(' ')[1]} {`${start}`.split(' ')[3]}</span></div>
    }
  return (
    <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Weekly/monthly chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Progress</h2>
                {timeframe === 'week' ? week() : month()}
              </div>
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
  )
}

export default ProgressReflection
