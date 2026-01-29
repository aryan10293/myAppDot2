import { useMutation } from "@tanstack/react-query";
import profileCheckin from "./profileCheckin";

const useProfileCheckin = () => {
  return useMutation({
    mutationFn: profileCheckin,
  });
};

export default useProfileCheckin;