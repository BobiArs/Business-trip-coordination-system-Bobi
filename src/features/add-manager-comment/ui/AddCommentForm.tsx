import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { useAddComment } from "../model/useAddComment";

interface AddCommentFormProps {
  tripId: string;
  onSuccess?: () => void;
  onError?: () => void;
}

const commentSchema = z.object({
  text: z.string().min(5, "Коментар має містити мінімум 5 символів"),
});

type CommentFormValues = z.infer<typeof commentSchema>;

export default function AddCommentForm({
  tripId,
  onSuccess,
  onError,
}: AddCommentFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  const addComment = useAddComment();
  const onSubmit = (data: CommentFormValues) => {
    addComment.mutate(
      { tripId, text: data.text },
      {
        onSuccess: () => {
          reset();
          onSuccess?.();
        },
        onError: () => {
          onError?.();
        },
      },
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Залишити коментар
        </label>
        <textarea
          {...register("text")}
          className="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 outline-none transition-all text-sm text-slate-800 dark:text-slate-200 min-h-[5rem]"
          placeholder="Напишіть коментар або додаткові вказівки щодо відрядження..."
        />
        {errors.text && (
          <p className="text-rose-500 text-xs font-medium mt-1 pl-1">
            {errors.text.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={addComment.isPending}
        className="flex items-center justify-center gap-1.5 px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-purple-500/10 hover:shadow-purple-500/20 active:scale-98 cursor-pointer disabled:opacity-75 disabled:pointer-events-none"
      >
        {addComment.isPending ? (
          <>
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Надсилаємо...
          </>
        ) : (
          "Додати коментар"
        )}
      </button>
    </form>
  );
}
