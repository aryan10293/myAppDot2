import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
function useTags(goalName: string)  {
    const navigate = useNavigate();
    return useQuery({
        queryKey: ["tags", goalName],
        queryFn: async () => {
        const response = await fetch(`http://localhost:2050/tags/${goalName.split(' ').join("")}`, {
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
export default useTags