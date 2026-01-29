const profileCheckin = async () => {
  const res = await fetch("http://localhost:2050/checkforcheckin", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Request failed");
  }

  return res.json();
};

export default profileCheckin;
