import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BusinessTrip } from "../../../entities/trip/model/types";
import { tripApi } from "../../../shared/api/tripApi";

interface ApproveTripInput {
  tripId: string;
  newStatusId: string;
}

export const useApproveTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<BusinessTrip, Error, ApproveTripInput>({
    mutationFn: ({ tripId, newStatusId }) =>
      tripApi.updateStatus(tripId, newStatusId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["trip", variables.tripId] });
      queryClient.invalidateQueries({
        queryKey: ["trip-history", variables.tripId],
      });
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};
