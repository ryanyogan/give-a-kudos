import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";
import type { User } from "@prisma/client";
import { Link, useNavigate } from "@remix-run/react";

type UserPanelProps = {
  open: boolean;
  setOpen: (...args: any) => any;
  users?: User[];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  console.log("foo", users);
  return json({ users });
};

export const people = [
  {
    name: "Leonard Krasner",
    handle: "leonardkrasner",
    imageUrl:
      "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Floyd Miles",
    handle: "floydmiles",
    imageUrl:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Emily Selman",
    handle: "emilyselman",
    imageUrl:
      "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
  {
    name: "Kristin Watson",
    handle: "kristinwatson",
    imageUrl:
      "https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  },
];

export const UserPanel = ({ open = false, setOpen, users }: UserPanelProps) => {
  const navigate = useNavigate();

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                    <div className="bg-indigo-700 py-6 px-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-medium text-white">
                          {" "}
                          Team Members{" "}
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="rounded-md bg-indigo-700 text-indigo-200 hover:text-white focus:outline-none"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-indigo-300">
                          Select an individual to give them the proper `Kudos`
                          they deserve!
                        </p>
                      </div>
                    </div>
                    <div className="relative flex-1 py-6 px-4 sm:px-6">
                      {/* Replace with your content */}
                      <div className="absolute inset-0 py-6 px-4 sm:px-6">
                        <div className="flow-root mt-6">
                          <ul className="-my-5 divide-y divide-gray-200">
                            {users &&
                              users.map((user) => (
                                <li key={user.id} className="py-4">
                                  <div className="flex items-center space-x-4">
                                    <div className="flex-shrink-0">
                                      <img
                                        className="h-8 w-8 rounded-full"
                                        src={people[0].imageUrl}
                                        alt=""
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {user.profile.firstName}{" "}
                                        {user.profile.lastName}
                                      </p>
                                      <p className="text-sm text-gray-500 truncate">
                                        {user.profile.handle}
                                      </p>
                                    </div>
                                    <div>
                                      <Link
                                        prefetch="intent"
                                        to={`kudo/${user.id}`}
                                        className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
                                        onClick={() => setOpen(false)}
                                      >
                                        Send Kudos!
                                      </Link>
                                    </div>
                                  </div>
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div className="mt-6">
                          <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            View all
                          </button>
                        </div>
                      </div>
                      {/* /End replace */}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};
