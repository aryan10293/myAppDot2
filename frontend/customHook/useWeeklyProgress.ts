import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";


function useWeeklyProgress({ goalname }: { goalname: string })  {
    const navigate = useNavigate();
    return useQuery({
        queryKey: ["weeklyprogress", goalname],
        queryFn: async () => {
        const response = await fetch(`http://localhost:2050/weeklyprogress`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
             body: JSON.stringify({
                goalname: goalname,
            })
        });
        if (response.status === 401) {
            navigate("/login");
            return;
        } 
        return response.json();
        }
    });
}
export default useWeeklyProgress