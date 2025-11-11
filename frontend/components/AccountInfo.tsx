import React from 'react'
import SmallCard from './SmallCard'
import { useNavigate } from "react-router-dom";
import logout from '../utils/logout';
function AccountInfo() {
  const navigate = useNavigate();
  const logoutFunction = async () => {
    await logout();
    navigate("/"); // or /login
  }
  return (
    <SmallCard>
        <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900">Account</h3>
        </div>
        <div className="flex flex-col gap-2">
            <button onClick={() => navigate("/settings/notifications")} className="text-left text-sm px-3 py-2 rounded-md hover:bg-gray-50">Notifications</button>
            <button onClick={() => navigate("/settings/theme")} className="text-left text-sm px-3 py-2 rounded-md hover:bg-gray-50">Theme</button>
            <div className="border-t pt-2 mt-2">
                <button onClick={logoutFunction} className="w-full text-sm px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
            </div>
        </div>
      
    </SmallCard>
  )
}

export default AccountInfo
