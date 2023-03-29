import {
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { CreatePostForm } from "~/components/CreatePostForm";

export const Header = () => {
  const { isSignedIn } = useUser();

  return (
    <div className="flex border border-slate-400 p-4">
      {!isSignedIn && (
        <div className="flex justify-center">
          <SignInButton />
        </div>
      )}
      {isSignedIn && (
        <div className="flex w-full gap-3">
          <UserButton
            appearance={{
              elements: {
                userButtonAvatarBox: {
                  width: 56,
                  height: 56,
                },
              },
            }}
          />
          <CreatePostForm />
          <div className="ml-8 flex">
            <SignOutButton />
          </div>
        </div>
      )}
    </div>
  );
};
