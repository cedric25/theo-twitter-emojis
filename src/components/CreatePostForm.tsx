import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/loading";

export const CreatePostForm = () => {
  const { user } = useUser();

  const ctx = api.useContext();

  type Inputs = {
    chirpInput: string;
  };

  const { register, handleSubmit, watch, reset } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutate({ content: data.chirpInput });
  };

  const showSubmitButton = watch("chirpInput");

  const { mutate, isLoading: isPosting } = api.posts.create.useMutation({
    onSuccess: () => {
      reset({ chirpInput: "" });
      void ctx.posts.getAll.invalidate();
      // chirpInputRef.current.focus();
    },
    onError: (err) => {
      const errorMessage = err.data?.zodError?.fieldErrors.content;
      if (errorMessage && errorMessage[0]) {
        toast.error(errorMessage[0]);
      } else {
        toast.error("Failed to post! Please try again later.");
      }
      // chirpInputRef.current.focus();
    },
  });

  if (!user) return null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full">
      <input
        type="text"
        placeholder="Type some emojis!"
        className="grow bg-transparent pl-2 outline-none"
        defaultValue=""
        {...register("chirpInput")}
        disabled={isPosting}
        autoFocus
      />
      {showSubmitButton && !isPosting && (
        <button type="submit" disabled={isPosting}>
          Post
        </button>
      )}
      {isPosting && (
        <div className="flex items-center justify-center">
          <LoadingSpinner size={20} />
        </div>
      )}
    </form>
  );
};
