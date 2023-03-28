import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import { createProxySSGHelpers } from "@trpc/react-query/ssg";
import { api } from "~/utils/api";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import superjson from "superjson";
import { PageLayout } from "~/components/layout";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data } = api.profile.getUserByUsername.useQuery({
    username,
  });

  // No more loading state thanks to getStaticProps and TRPC SSG helper down below
  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  if (!data) {
    return <div>User not found</div>;
  }

  return (
    <>
      <Head>
        <title>{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 border-slate-400 bg-slate-600">
          <img
            src={data.profileImageUrl}
            alt={`${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-[64px] ml-4 rounded-full border-4 border-black bg-black"
          />
        </div>
        <div className="h-[64px]"></div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

// Small tricks to prefetch data before rendering the page
export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createProxySSGHelpers({
    router: appRouter,
    ctx: { prisma, userId: null },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") {
    throw new Error("No slug");
  }

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({ username });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
