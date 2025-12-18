import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
    goal:any;
    refetch: () => void;
}
function EditGoalComp({goal, refetch} : Props ) {
    const [editGoal, setEditGoal] = React.useState<string>(goal.goalname);
    const [editDescription, setEditDescription] = React.useState<string>(goal.description || "");
    const [editFrequency, setEditFrequency] = React.useState<string>(goal.frequency || "daily");
    const [editMinutes, setEditMinutes] = React.useState<number>(goal.minutes || 5);
    const [editPrivacy, setEditPrivacy] = React.useState<string>(goal.privacy || "private");
    const [open, setOpen] = React.useState<boolean>(false);
    const handleDelete = async (goalName:string) => {
    const response = await fetch(`http://localhost:2050/goal/${goalName}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include"
    });

   const data = await response.json();
    if(data.status === "200"){
        alert(data.message);
        refetch();
        //window.location.reload();
    }
  }
  const handleEdit = async (e:any, ) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:2050/goal/${goal.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: "include",
      body: JSON.stringify({ title: editGoal, description: editDescription, frequency: editFrequency, minutes: editMinutes, privacy: editPrivacy }),
    });

   const data = await response.json();
    if(data.status === "200"){
        alert(data.message);
        setOpen(!open);
        refetch();
    }
  }
  return (
    <li className="border border-gray-100 rounded-md overflow">
        <div className={`p-3 flex items-start ${open? "" : "justify-between"} gap-3`}>
            <div className="min-w-0">
            <div className="text-sm font-semibold text-gray-900 truncate">{open ? " " : goal.goalname}</div>
            {/* <div className="text-xs text-gray-500 mt-1">{g.description ? g.description : " "}</div> */}
            <div className="mt-2 text-xs text-gray-500 flex gap-3">
                {/* <span>Frequency: <strong className="text-gray-700 ml-1">{g.frequency}</strong></span>
                <span>Minutes: <strong className="text-gray-700 ml-1">{g.minutes}</strong></span> */}
            </div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
            <details className="group" open={open}>
                <summary onClick={(e) => {e.preventDefault(); setOpen(!open) }} className="cursor-pointer inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs bg-white border hover:bg-gray-50">
                Edit 
                </summary>
                {/* i may need to toggle this or change the whole approach to make this work */}

                <div className={`mt-3 p-3 bg-gray-50 border border-gray-100 rounded-md`}>
                <form  className="space-y-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-700">Title</label>
                        <input name="title" value={editGoal} onChange={(e)=> {setEditGoal(e.target.value)}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-700">Description</label>
                        <input name="description" value={editDescription} onChange={(e) => {setEditDescription(e.target.value)}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    </div>
                    <div>
                            <label className="block text-xs font-medium text-gray-700">Privacy</label>
                            <select name="privacy"  value={editPrivacy} onChange={(e) => {setEditPrivacy(e.target.value)}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                <option value="private">Private</option>
                                <option value="public">Public</option>
                                <option value="buddies">Buddies</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-700">Minutes</label>
                            <input name="minutes" type="number" min={1} value={editMinutes} onChange={(e) => {setEditMinutes(parseInt(e.target.value))}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            <div>
                                <label className="block text-xs font-medium text-gray-700">Frequency</label>
                                <select name="frequency" value={editFrequency} onChange={(e) => {setEditFrequency(e.target.value)}} className="mt-1 block w-full px-3 py-2 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                </select>
                            </div>
                        </div>

                    <div className="flex items-center gap-2">
                    <button type="submit" onClick={handleEdit} className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">Save</button>
                    <button type="button" onClick={()=> {handleDelete(goal.goalname)}} className="px-3 py-2 border rounded-md text-sm">Delete</button>
                    </div>
                </form>
                </div>
            </details>
            <Link   to={`/goal/${goal.urlname}`} className={`${open ? "hidden" : "inline-flex"} cursor-pointer items-center gap-2 px-3 py-1 rounded-md text-xs bg-white border hover:bg-gray-50`}>
                View
            </Link>
            </div>
        </div>
    </li>
  )
}

export default EditGoalComp
