import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import useGoals from "../customHook/goals"
import Loading from "../components/Loading";

/**
 * EditGoals.tsx
 * - UI-only page for listing goals, editing existing ones, and creating new goals.
 * - Uses <details> to open edit forms without JS; each form currently prevents default submit.
 * - Hook your API or state logic into the onSubmit handlers or replace with your handlers.
 */

export default function EditGoals(): React.JSX.Element {
    const { data: goals, isLoading, refetch } = useGoals();
    const [title, setTitle] = useState<string>("");
    const [privacy, setPrivacy] = useState<string>("private")

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await fetch('http://localhost:2050/creategoal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ title, privacy }),
    });

   const data = await response.json();
   if(data.status === "201"){
    setTitle('');
    alert(goals.message);
    refetch();
   }
  };

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>, id: string) => {
    e.preventDefault();
    console.log("update submit for", id);
  };

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

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: Create new goal */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900">Create a new goal</h2>
            <p className="text-sm text-gray-500 mt-1">Start with a tiny, achievable goal.</p>

            <form onSubmit={handleCreate} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Title</label>
                <input name="title" onChange={(e) => {setTitle(e.target.value)}} value={title} required placeholder="e.g. 5 minute stretch" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Short description</label>
                <input name="description" placeholder="Optional: quick note about this goal" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-gray-700">Frequency</label>
                  <select name="frequency"  defaultValue="daily" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Minutes</label>
                  <input name="minutes" type="number" min={1} defaultValue={5} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Your goals</h2>
                <span className="text-xs text-gray-500">{goals.length} goals</span>
              </div>

              <ul className="mt-4 space-y-3">
                {goals.map((g) => (
                  <li key={g.id} className="border border-gray-100 rounded-md overflow-hidden">
                    <div className="p-3 flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm font-semibold text-gray-900">{g.goalname}</div>
                        {/* <div className="text-xs text-gray-500 mt-1">{g.description ? g.description : " "}</div> */}
                        <div className="mt-2 text-xs text-gray-500 flex gap-3">
                          {/* <span>Frequency: <strong className="text-gray-700 ml-1">{g.frequency}</strong></span>
                          <span>Minutes: <strong className="text-gray-700 ml-1">{g.minutes}</strong></span> */}
                        </div>
                      </div>

                      <div className="flex-shrink-0 flex items-center gap-2">
                        <details className="group">
                          <summary  className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs bg-white border hover:bg-gray-50">
                            Edit
                          </summary>

                          <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md">
                            <form onSubmit={(e) => handleUpdate(e, g.id)} className="space-y-3">
                              <div>
                                <label className="block text-xs font-medium text-gray-700">Title</label>
                                <input name="title" defaultValue={g.goalname} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                              </div>

                              <div>
                                <label className="block text-xs font-medium text-gray-700">Description</label>
                                <input name="description"  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700">Frequency</label>
                                  <select name="frequency"  className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="custom">Custom</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700">Minutes</label>
                                  <input name="minutes" type="number"  min={1} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700">Status</label>
                                  <select name="status" defaultValue="active" className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="active">Active</option>
                                    <option value="paused">Paused</option>
                                    <option value="archived">Archived</option>
                                  </select>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Save</button>
                                <button type="button" onClick={() => {console.log("lmao")}} className="px-3 py-2 border rounded-md text-sm">Delete</button>
                              </div>
                            </form>
                          </div>
                        </details>
                      </div>
                    </div>
                  </li>
                ))}
                {/* onClick={showAll} */}
                {/* {number === 3 ? "Show All" : "Show 3"} */}
                <button  className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Show All</button>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}