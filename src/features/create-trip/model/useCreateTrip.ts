import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { BusinessTrip } from "../../../entities/trip/model/types";
import { tripApi } from "../../../shared/api/tripApi";

interface CreateTripInput {
  purposeId: string;
  description: string;
  destination: string;
  startDate: string;
  endDate: string;
  urgencyId: string;
  employeePhone: string;
}

export const useCreateTrip = () => {
  const queryClient = useQueryClient();

  return useMutation<BusinessTrip, Error, CreateTripInput>({
    mutationFn: tripApi.createTrip,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
    },
  });
};
