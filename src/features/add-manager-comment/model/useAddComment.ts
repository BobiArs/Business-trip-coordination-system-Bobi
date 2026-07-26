import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripApi } from "../../../shared/api/tripApi";
import type { Comment } from "../../../entities/trip/model/types";

interface AddCommentInput {
  tripId: string;
  text: string;
}

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, AddCommentInput>({
    mutationFn: ({ tripId, text }) => tripApi.addComment(tripId, text),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["trip-comments", variables.tripId],
      });
    },
  });
};
