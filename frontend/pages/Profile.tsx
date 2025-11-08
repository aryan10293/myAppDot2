import React from 'react'
import Loading from '../components/Loading';
import { useNavigate } from "react-router-dom";
import { useQuery } from '@tanstack/react-query';
function Profile() {
    const navigate = useNavigate();
    const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await fetch('http://localhost:2050/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // include cookies for authentication
        });
        if (response.status === 401) {
            // Not authenticated, redirect to login
            navigate('/login');
            return;
        }
        console.log(response)
      return response.json();
    },
  });

//   if (isLoading) return <p>Loading...</p>;
//   return <h1>Welcome, {user.name}</h1>;

    const logout = async () => {
        const response = await fetch('http://localhost:2050/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // include cookies for authentication
        });
        const data = await response.json();
        console.log(data);
      }
  return (
    <div>
      {
        isLoading ? (
          <Loading message="Loading profile..." overlay={true} />
        ) : (
          <div>
            <h1>Welcome, {user.user.firstname} {user.user.lastname}!</h1>
            <button onClick={logout} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600">Logout</button>
        </div>
        )
      }    
    </div>
  )
}

export default Profile
