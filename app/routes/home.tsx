import type { Kudo as IKudo, Profile, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticated-layout";
import { Kudo } from "~/components/kudo";
import { getUser, requireUserId } from "~/utils/auth.server";
import { getFilteredKudos } from "~/utils/kudos.server";
import { getOtherUsers, getUserById } from "~/utils/user.server";
import { MailIcon, PhoneIcon } from "@heroicons/react/solid";

interface KudoWithProfile extends IKudo {
  author: {
    profile: Profile;
  };
  recipient: User;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
const profile = {
  name: "Ricardo Cooper",
  email: "ricardo.cooper@example.com",
  avatar:
    "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
  backgroundImage:
    "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
  fields: [
    ["Phone", "(555) 123-4567"],
    ["Email", "ricardocooper@example.com"],
    ["Title", "Senior Front-End Developer"],
    ["Team", "Product Development"],
    ["Location", "San Francisco"],
    ["Sits", "Oasis, 4th floor"],
    ["Salary", "$145,000"],
    ["Birthday", "June 8, 1990"],
  ],
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const user = await getUserById(userId);
  const users = await getOtherUsers(userId);
  const kudos = await getFilteredKudos(userId, {}, {});

  return json({ users, kudos, user });
};

const Home = () => {
  const { users, kudos, user } = useLoaderData();

  return (
    <AuthenticatedLayout users={users}>
      <div>
        <div>
          <img
            className="h-32 w-full object-cover lg:h-48"
            src={profile.backgroundImage}
            alt=""
          />
        </div>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
            <div className="flex">
              <img
                className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
                src={profile.avatar}
                alt=""
              />
            </div>
            <div className="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
              <div className="sm:hidden md:block mt-6 min-w-0 flex-1">
                <h1 className="text-2xl font-bold text-gray-900 truncate">
                  {user.profile.firstName} {user.profile.lastName}
                </h1>
              </div>
              <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <MailIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Message</span>
                </button>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  <PhoneIcon
                    className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Call</span>
                </button>
              </div>
            </div>
          </div>
          <div className="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-gray-900 truncate">
              {user.profile.firstName} {user.profile.lastName}
            </h1>
          </div>
        </div>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-gray-50 px-2 text-gray-500 font-bold text-sm">
            <span>Recent Kudos</span>
          </span>
        </div>
      </div>

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
