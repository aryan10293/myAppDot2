const logout = async () => {   
    const response = await fetch("http://localhost:2050/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
   // navigate("/"); // or /login
  };

  export default logout