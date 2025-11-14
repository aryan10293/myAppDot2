import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
function useUser()  {
    const navigate = useNavigate();
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
        const response = await fetch("http://localhost:2050/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });
        if (response.status === 401) {
            navigate("/login");
            return;
        } 

        return response.json();
        }
    });
}
export default useUser