import React, { useMemo, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import useOneGoal from '../customHook/getOneGoal';
import useWeeklyProgress from '../customHook/useWeeklyProgress';
import { DateTime, Interval } from 'luxon';

type ViewMode = 'yearly' | 'monthly' | 'weekly';

interface MonthStats {
  month: string;
  monthYear: string;
  completions: number;
  percentage: number;
  daysInMonth: number;
}

interface WeekStats {
  week: number;
  startDate: string;
  endDate: string;
  completions: number;
  percentage: number;
  dateRange: string;
}

function TrackProgress() {
  const { goalname } = useParams<{ goalname: string }>();
  const navigate = useNavigate();
  const { data: goal, isLoading } = useOneGoal(goalname || '');
  const { data: weeklyProgress, isLoading: isWeeklyProgressLoading } = useWeeklyProgress({ goalname: goalname || ' ' });

  const [viewMode, setViewMode] = useState<ViewMode>('yearly');

  if(isWeeklyProgressLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-gray-600 text-lg">Loading progress data...</div>
      </div>
    );
  }

  const g = goal?.goal || goal || {};
  const checkindates = g?.checkindates || [];
  const createdDate = g?.createddate ? DateTime.fromISO(g.createddate) : DateTime.now();
  const currentStreak = g?.streak || 0;
  const longestStreak = g?.longeststreak || 0;
  const totalCompletions = g?.totalcheckins || checkindates.length || 0;
  const daysSinceCreation = Math.floor(DateTime.now().diff(createdDate, 'days').days);
  const overallPercentage = daysSinceCreation > 0 ? ((totalCompletions / daysSinceCreation) * 100).toFixed(1) : 0;

  // Build completed set for fast lookup
  const completedSet = useMemo(() => {
    return new Set(checkindates.map((d: string) => {
      const parsed = DateTime.fromISO(d);
      return parsed.toISO()?.split('T')[0] || '';
    }));
  }, [checkindates]);

  // Calculate monthly stats
  const monthlyStats = useMemo(() => {
    const stats: MonthStats[] = [];
    let current = createdDate.startOf('month');
    const now = DateTime.now();

    while (current <= now) {
      const monthEnd = current.endOf('month');
      const monthCheckins = checkindates.filter((d: string) => {
        const parsed = DateTime.fromISO(d);
        const isoDate = parsed.toISO()?.split('T')[0];
        const monthStart = current.toISO()?.split('T')[0];
        const monthEndStr = monthEnd.toISO()?.split('T')[0];
        return isoDate && isoDate >= monthStart! && isoDate <= monthEndStr!;
      }).length;

      const daysInMonth = monthEnd.diff(current, 'days').days + 1;
      const percentage = (monthCheckins / daysInMonth) * 100;

      stats.push({
        month: current.toFormat('MMM'),
        monthYear: current.toFormat('MMM yyyy'),
        completions: monthCheckins,
        percentage: Math.round(percentage),
        daysInMonth: Math.ceil(daysInMonth),
      });

      current = current.plus({ months: 1 });
    }

    return stats;
  }, [createdDate, checkindates]);

  // Calculate weekly stats (last 12 weeks)
  const weeklyStats = useMemo(() => {
    const stats: WeekStats[] = [];
    const now = DateTime.now();
    let current = now.minus({ weeks: 11 }).startOf('week');

    for (let i = 0; i < 12; i++) {
      const weekEnd = current.endOf('week');
      const weekCheckins = checkindates.filter((d: string) => {
        const parsed = DateTime.fromISO(d);
        const isoDate = parsed.toISO()?.split('T')[0];
        const weekStart = current.toISO()?.split('T')[0];
        const weekEndStr = weekEnd.toISO()?.split('T')[0];
        return isoDate && isoDate >= weekStart! && isoDate <= weekEndStr!;
      }).length;

      const daysInWeek = 7;
      const percentage = (weekCheckins / daysInWeek) * 100;
      const weekNum = current.weekNumber;

      stats.push({
        week: weekNum,
        startDate: current.toISO()?.split('T')[0] || '',
        endDate: weekEnd.toISO()?.split('T')[0] || '',
        completions: weekCheckins,
        percentage: Math.round(percentage),
        dateRange: `${current.toFormat('MMM d')} - ${weekEnd.toFormat('MMM d')}`,
      });

      current = current.plus({ weeks: 1 });
    }

    return stats;
  }, [checkindates]);

  // Find best month and week
  const bestMonth = monthlyStats.length > 0 
    ? monthlyStats.reduce((prev, current) => (prev.completions > current.completions) ? prev : current)
    : null;
  const bestWeek = weeklyStats.length > 0
    ? weeklyStats.reduce((prev, current) => (prev.completions > current.completions) ? prev : current)
    : null;

  // Yearly stats
  const yearlyData = useMemo(() => {
    const now = DateTime.now();
    const thisYear = monthlyStats.filter(m => m.monthYear.includes(now.year.toString()));
    const thisYearCompletions = thisYear.reduce((sum, m) => sum + m.completions, 0);
    const thisYearAvg = thisYear.length > 0 ? Math.round(thisYearCompletions / thisYear.length) : 0;
    
    return {
      totalCompletions: thisYearCompletions,
      averagePerMonth: thisYearAvg,
      monthsActive: thisYear.length,
    };
  }, [monthlyStats]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/editgoals')}
            className="text-indigo-600 hover:underline text-sm mb-3 block"
          >
            ← Back to goals
          </button>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">{g.goalname} Recap</h1>
          <p className="text-gray-600">Your progress journey since {createdDate.toFormat('MMMM yyyy')}</p>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Total Completions</p>
            <p className="text-3xl md:text-4xl font-bold text-indigo-600">{totalCompletions}</p>
            <p className="text-xs text-gray-500 mt-2">across {daysSinceCreation} days</p>
          </div>

          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Overall Streak</p>
            <p className="text-3xl md:text-4xl font-bold text-green-600">{currentStreak}</p>
            <p className="text-xs text-gray-500 mt-2">days active</p>
          </div>

          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Best Streak</p>
            <p className="text-3xl md:text-4xl font-bold text-purple-600">{longestStreak}</p>
            <p className="text-xs text-gray-500 mt-2">personal record</p>
          </div>

          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs md:text-sm text-gray-600 font-medium mb-2">Consistency</p>
            <p className="text-3xl md:text-4xl font-bold text-blue-600">{overallPercentage}%</p>
            <p className="text-xs text-gray-500 mt-2">completion rate</p>
          </div>
        </div>

        {/* View Mode Selector */}
        <div className="flex gap-2 mb-8">
          {(['yearly', 'monthly', 'weekly'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-4 py-2.5 rounded-lg font-medium transition-all ${
                viewMode === mode
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white/80 border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mode === 'yearly' ? '📅 Yearly' : mode === 'monthly' ? '📊 Monthly' : '📈 Weekly'}
            </button>
          ))}
        </div>

        {/* Yearly View */}
        {viewMode === 'yearly' && (
          <div className="space-y-6">
            {/* Year Summary */}
            <div className="bg-gradient-to-br from-white/90 to-white/70 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">This Year Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Completions This Year</p>
                  <p className="text-4xl font-bold text-indigo-600">{yearlyData.totalCompletions}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Average Per Month</p>
                  <p className="text-4xl font-bold text-green-600">{yearlyData.averagePerMonth}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Months Active</p>
                  <p className="text-4xl font-bold text-purple-600">{yearlyData.monthsActive}</p>
                </div>
              </div>

              {/* Months Chart */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Performance</h3>
                <div className="space-y-3">
                  {monthlyStats.map((month, idx) => {
                    const maxCompletion = Math.max(...monthlyStats.map(m => m.completions), 1);
                    return (
                      <div key={idx} className="group">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{month.monthYear}</span>
                          <span className="text-sm font-bold text-indigo-600">{month.completions} days</span>
                        </div>
                        <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-lg transition-all duration-300 flex items-center justify-end pr-3"
                            style={{ width: `${(month.completions / maxCompletion) * 100}%` }}
                          >
                            {month.completions > 0 && (
                              <span className="text-xs font-bold text-white">{month.percentage}%</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Best Month Highlight */}
            {bestMonth && (
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-2xl p-6 md:p-8">
                <p className="text-sm font-semibold text-indigo-600 mb-2">🏆 Your Best Month</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{bestMonth.monthYear}</h3>
                <p className="text-gray-700">You completed <span className="font-bold text-indigo-600">{bestMonth.completions} days</span> out of {bestMonth.daysInMonth} possible days ({bestMonth.percentage}% completion rate)</p>
              </div>
            )}
          </div>
        )}

        {/* Monthly View */}
        {viewMode === 'monthly' && (
          <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Monthly Breakdown</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Month List */}
              <div className="space-y-3">
                {monthlyStats.map((month, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-900">{month.monthYear}</span>
                      <span className="text-sm font-semibold text-indigo-600">{month.percentage}%</span>
                    </div>
                    <div className="text-sm text-gray-600">{month.completions} / {month.daysInMonth} days</div>
                  </div>
                ))}
              </div>

              {/* Pie Chart Alternative - Distribution */}
              <div className="flex flex-col items-center justify-center">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Total Distribution</h3>
                <div className="relative w-48 h-48">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {monthlyStats.reduce((acc, month, idx) => {
                      const totalMonths = monthlyStats.length;
                      const angle = (idx / totalMonths) * 360;
                      const colors = [
                        '#4F46E5', '#7C3AED', '#DC2626', '#EA580C', '#D97706',
                        '#EAB308', '#22C55E', '#10B981', '#14B8A6', '#06B6D4',
                        '#0EA5E9', '#3B82F6'
                      ];
                      const color = colors[idx % colors.length];
                      
                      return acc;
                    }, [] as JSX.Element[])}
                    <circle cx="50" cy="50" r="30" fill="white" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{monthlyStats.length}</p>
                      <p className="text-xs text-gray-600">months tracked</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {bestMonth && (
              <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                <p className="text-sm font-semibold text-green-600 mb-1">💪 Strongest Month</p>
                <p className="text-gray-900"><span className="font-bold">{bestMonth.monthYear}</span> with {bestMonth.completions} completions</p>
              </div>
            )}
          </div>
        )}

        {/* Weekly View */}
        {viewMode === 'weekly' && (
          <div className="bg-white/90 backdrop-blur border border-gray-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Last 12 Weeks</h2>
            
            <div className="space-y-3">
              {weeklyStats.map((week, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">Week {week.week}</p>
                      <p className="text-xs text-gray-600">{week.dateRange}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-indigo-600">{week.completions}/7</p>
                      <p className="text-xs text-gray-600">{week.percentage}%</p>
                    </div>
                  </div>
                  <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
                      style={{ width: `${week.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {bestWeek && (
              <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-600 mb-1">⚡ Best Week</p>
                <p className="text-gray-900"><span className="font-bold">{bestWeek.dateRange}</span> - {bestWeek.completions} completions ({bestWeek.percentage}%)</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TrackProgress
