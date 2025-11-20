import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
    goal:any;
    refetch: () => void;
}
function EditGoalComp({goal, refetch} : props ) {
    const handleDelete = async (goalName:string) => {
    console.log(goalName)
    const response = await fetch(`http://localhost:2050/deletegoal/${goalName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    });

   const data = await response.json();
   console.log(data)
    if(data.status === "200"){
        alert(data.message);
        refetch();
    }
  }
  console.log(goal)
  return (
    <li key={goal.id} className="border border-gray-100 rounded-md overflow-hidden">
        <div className="p-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{goal.goalname}</div>
            {/* <div className="text-xs text-gray-500 mt-1">{g.description ? g.description : " "}</div> */}
            <div className="mt-2 text-xs text-gray-500 flex gap-3">
                {/* <span>Frequency: <strong className="text-gray-700 ml-1">{g.frequency}</strong></span>
                <span>Minutes: <strong className="text-gray-700 ml-1">{g.minutes}</strong></span> */}
            </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
            <details className="group">
                <summary className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs bg-white border hover:bg-gray-50">
                Edit
                </summary>

                <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md">
                <form  className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Title</label>
                        <input name="title" value={goal.goalname} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
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
                    <button type="button" onClick={()=> {handleDelete(goal.goalname)}} className="px-3 py-2 border rounded-md text-sm">Delete</button>
                    </div>
                </form>
                </div>
            </details>
            <Link   to={`/goal/${goal.goalname}`} className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs bg-white border hover:bg-gray-50">
                View
            </Link>
            </div>
        </div>
    </li>
  )
}

export default EditGoalComp
