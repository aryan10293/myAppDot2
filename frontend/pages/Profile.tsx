import React from "react";
import { useState } from "react";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import useUser from "../customHook/user"
import ProfileHeader from "../components/ProfileHeader";
import Notes from "../components/Notes";
import SmallCard from "../components/SmallCard";
import Achievements from "../components/Achievements";
import AccountInfo from "../components/AccountInfo";

const buddies = [
  { id: "b1", name: "Alice", avatarUrl: null },
  { id: "b2", name: "Bob", avatarUrl: null },
  { id: "b3", name: "LeBron", avatarUrl: null },
];





export default function Profile(): React.JSX.Element {
  const navigate = useNavigate();
  const [update, setUpdate] = useState<boolean>(false);
  const [count, setCount] = useState<boolean>(false);
  const { data: user, isLoading } = useUser();



  const checkIn = async () => {
    const response = await fetch("http://localhost:2050/checkin", {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
    })
    const result = await response.json();
    setUpdate(result.updated);
    setCount(true);
  } 

  if (isLoading) return <Loading overlay message="Loading profile..." />;

  return (
  
    <div className="min-h-screen bg-slate-50 p-6">
      <main className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <p className="text-sm text-gray-500">A quick view of your progress and tools to stay consistent.</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/settings")}
              className="px-3 py-2 bg-white border rounded-md text-sm text-gray-700 hover:bg-gray-50"
            >
              Settings
            </button>
            <button
              onClick={() => navigate("/editgoals")}
              className="px-3 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Edit goals
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column: main profile + stats (spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-6">
            {/*will be profile data here im jsut making it into a component  */}
            <ProfileHeader user={user.user} update={update} />

            {/* Proof vault & reflections */}
            
            <Notes/>
           

            {/* Achievements */}
            <Achievements/>
          </div>

          {/* Right column: buddies, settings, logout */}
          <aside className="space-y-6">
            <SmallCard>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Buddies</h3>
                <button className="text-xs text-indigo-600 hover:underline" onClick={() => navigate("/buddies")}>Manage</button>
              </div>

              <div className="flex items-center gap-3">
                {buddies.slice(0, 6).map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-sm text-gray-700">
                      {b.avatarUrl ? <img src={b.avatarUrl} alt={b.name} className="h-full w-full object-cover rounded-full" /> : b.name?.[0]}
                    </div>
                    <div className="hidden sm:block">
                      <div className="text-sm font-medium text-gray-900">{b.name}</div>
                      <div className="text-xs text-gray-500">Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </SmallCard>

            {/* account info */}
            <AccountInfo/>

            <SmallCard>
              <div className="text-sm text-gray-600">Quick actions</div>
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={checkIn} className="w-full text-sm px-3 py-2 bg-indigo-600 text-white rounded-md">Add goal</button>
                <button onClick={checkIn} disabled={count} className="w-full text-sm px-3 py-2 border rounded-md">Check-in</button>
              </div>
            </SmallCard>
          </aside>
        </div>
      </main>
    </div>
  );
}
