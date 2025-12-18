import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useGoals from "../customHook/goals"
import Loading from "../components/Loading";
import EditGoalComp from "../components/EditGoalComp";

export default function EditGoals(): React.JSX.Element {
    const { data: goals, isLoading, refetch } = useGoals();
    const [title, setTitle] = useState<string>("");
    const [minutes, setMinutes] = useState<number>(5);
    const [description, setDescription] = useState<string>("");
    const [privacy, setPrivacy] = useState<string>("private");
    const [frequency, setFrequency] = useState<string>("daily");
    const [showAll, setShowAll ] = useState<boolean>(false);
    const [count, setCount] = useState<number>(3);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:2050/goal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ title, privacy, minutes, description, frequency }),
    });

   const data = await response.json();
        if(data.status === "201"){
            setTitle('');
            setMinutes(5);
            setDescription('');
            setPrivacy('private');
            setFrequency('daily');
            alert(data.message);
            refetch();
        }
    };

    const displayOfGoals = () => {
      setShowAll(!showAll);
      if(!showAll){
        setCount(goals.length);
      } else {
        setCount(3);
      }
    }


  if (isLoading) return <Loading overlay message="Loading goals..." />;

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-4xl mx-auto">
        <header className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Goals</h1>
            <p className="mt-1 text-sm text-gray-600">Create new goals or update existing ones. Keep them small and forgiving.</p>
          </div>

          <div className="flex gap-3">
            <Link to="/profile" className="text-sm px-3 py-2 border rounded-md bg-white hover:bg-gray-50">Back to profile</Link>
          </div>
        </header>

        {/* Responsive two-column: stacks on xs, side-by-side from sm+ */}
        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-start">
          {/* Left: Create new goal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm h-full min-h-[220px]">
            <h2 className="text-lg font-semibold text-gray-900">Create a new goal</h2>
            <p className="text-sm text-gray-500 mt-1">Start with a tiny, achievable goal.</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Title</label>
                <input name="title" onChange={(e) => {setTitle(e.target.value)}} value={title} required placeholder="e.g. 5 minute stretch" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Short description (Optional)</label>
                <input name="description" onChange={(e) => {setDescription(e.target.value)}} value={description} placeholder=" I want to work out 4× a week " className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Frequency</label>
                  <select name="frequency"  defaultValue={frequency} onChange={(e) => {setFrequency(e.target.value)}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Minutes</label>
                  <input name="minutes" type="number" min={0} onChange={(e) => {setMinutes(parseInt(e.target.value))}}  value={minutes} defaultValue={5} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Privacy</label>
                  <select name="privacy" onChange={(e) => {setPrivacy(e.target.value)}} defaultValue="private" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="private">Private</option>
                    <option value="buddies">Buddies</option>
                    <option value="public">Public</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Create goal</button>
                <button type="reset" className="px-4 py-2 border rounded-md text-sm">Clear</button>
              </div>
            </form>
          </div>

          {/* Right: Existing goals list with edit panels */}
          <div className="space-y-4 h-full flex flex-col">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex-1 overflow-auto min-h-[220px]">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your goals</h2>
                {/* if goals.length is less than 
                3 it should show 3 goals, 2goals whateve

                if goals.length is greater that 3 and show alll is truye display 
                all goals or 4 goals etx...
                */}
                <span className="text-xs text-gray-500">{goals.length} {goals.length === 1 ? "goal" : "goals"}</span>
              </div>
              {goals.length === 0 ? (
            <div className="bg-white rounded-2xl  border-gray-100 p-6  h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">No goals found. Create one to get started!</p>
            </div>
              ) : (
                <div className="space-y-4">
                  <ul className="mt-4 space-y-3">
                    {goals.slice(0, 3).map((g) => (
                        <EditGoalComp key={g.id} goal={g} refetch={refetch} />
                    ))}

                    {showAll && goals.slice(3).map((g) => (
                        <EditGoalComp key={g.id} goal={g} refetch={refetch} />
                    ))}
                      <div className="mt-3">
                        <button
                         className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
                        onClick={displayOfGoals}
                         >{showAll ? "Show Less" : "Show All"}</button>
                      </div>
                
                  </ul>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
