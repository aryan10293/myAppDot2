import React from 'react'

function Profile() {
    const checkUser = async () => {
        const response = await fetch('http://localhost:2050/profile', {
          method: 'GET',
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
      <button onClick={checkUser}>
        check user
      </button>
    </div>
  )
}

export default Profile
