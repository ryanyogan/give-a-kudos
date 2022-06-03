import type { Kudo as IKudo, Profile, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticated-layout";
import { Kudo } from "~/components/kudo";
import { requireUserId } from "~/utils/auth.server";
import { getFilteredKudos } from "~/utils/kudos.server";
import { getOtherUsers } from "~/utils/user.server";

interface KudoWithProfile extends IKudo {
  author: {
    profile: Profile;
  };
  recipient: User;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  const kudos = await getFilteredKudos(userId, {}, {});

  return json({ users, kudos });
};

const Home = () => {
  const { users, kudos } = useLoaderData();

  return (
    <AuthenticatedLayout users={users}>
      <Outlet />
      <div className="max-w-7xl mx-auto sm:p-6 lg:p-8">
        <div className="rounded-lg bg-gray-200 overflow-hidden shadow divide-y divide-gray-200 sm:divide-y-0 sm:grid sm:grid-cols-2 sm:gap-px">
          {kudos.map((kudo: KudoWithProfile, kudoIdx: number) => (
            <div
              key={kudo.id}
              className={classNames(
                kudoIdx === 0
                  ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none"
                  : "",
                kudoIdx === 1 ? "sm:rounded-tr-lg" : "",
                kudoIdx === kudos.length - 2 ? "sm:rounded-bl-lg" : "",
                kudoIdx === kudos.length - 1
                  ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
                  : "",
                "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
              )}
            >
              <Kudo
                kudo={kudo}
                kudoIdx={kudoIdx}
                profile={kudo.author.profile}
                recipient={kudo.recipient}
              />
            </div>
          ))}
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default Home;
