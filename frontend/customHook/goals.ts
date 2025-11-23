import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
function useGoals()  {
    const navigate = useNavigate();
    return useQuery({
        queryKey: ["goals"],
        queryFn: async () => {
        const response = await fetch("http://localhost:2050/goal", {
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
export default useGoals