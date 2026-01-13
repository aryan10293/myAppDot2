import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
function useTrackWeekData(goalname:string)  {
    const navigate = useNavigate();
    return useQuery({
        queryKey: ["goals", goalname],
        queryFn: async () => {
        const response = await fetch(`http://localhost:2050/trackweeklyprogress/${goalname}`, {
            method: "PATCH",
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
export default useTrackWeekData