import type { LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData, useLoaderData } from "@remix-run/react";
import { getUserById } from "~/utils/user.server";
import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { getUser } from "~/utils/auth.server";
import type { KudoStyle } from "@prisma/client";
import { MailIcon, PhoneIcon } from "@heroicons/react/solid";
import {
  EmojiHappyIcon,
  EmojiSadIcon,
  FireIcon,
  HeartIcon,
  PaperClipIcon,
  ThumbUpIcon,
  XIcon,
} from "@heroicons/react/solid";
import { Listbox } from "@headlessui/react";
import { CalendarIcon, TagIcon, UserCircleIcon } from "@heroicons/react/solid";
import { colorMap, emojiMap } from "~/utils/constants";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const moods = [
  {
    name: "Excited",
    value: "excited",
    icon: FireIcon,
    iconColor: "text-white",
    bgColor: "bg-red-500",
  },
  {
    name: "Loved",
    value: "loved",
    icon: HeartIcon,
    iconColor: "text-white",
    bgColor: "bg-pink-400",
  },
  {
    name: "Happy",
    value: "happy",
    icon: EmojiHappyIcon,
    iconColor: "text-white",
    bgColor: "bg-green-400",
  },
  {
    name: "Sad",
    value: "sad",
    icon: EmojiSadIcon,
    iconColor: "text-white",
    bgColor: "bg-yellow-400",
  },
  {
    name: "Thumbsy",
    value: "thumbsy",
    icon: ThumbUpIcon,
    iconColor: "text-white",
    bgColor: "bg-blue-500",
  },
  {
    name: "I feel nothing",
    value: null,
    icon: XIcon,
    iconColor: "text-gray-400",
    bgColor: "bg-transparent",
  },
];

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;

  if (typeof userId !== "string") {
    return redirect("/home");
  }

  const recipient = await getUserById(userId);
  const user = await getUser(request);
  return json({ recipient, user });
};

const KudoModal = () => {
  const { recipient, user } = useLoaderData();
  const [open, setOpen] = useState(true);
  const cancelButtonRef = useRef(null);
  const actionData = useActionData();
  const [formError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    message: "",
    style: {
      backgroundColor: "RED",
      textColor: "WHITE",
      emoji: "THUMBSUP",
    } as KudoStyle,
  });
  const [selected, setSelected] = useState(moods[5]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((data) => ({ ...data, [field]: e.target.value }));
  };
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
  const assignees = [
    { name: "Unassigned", value: null },
    {
      name: "Wade Cooper",
      value: "wade-cooper",
      avatar:
        "https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
    },
    // More items...
  ];
  const labels = [
    { name: "Unlabelled", value: null },
    { name: "Engineering", value: "engineering" },
    // More items...
  ];
  const dueDates = [
    { name: "No due date", value: null },
    { name: "Today", value: "today" },
    // More items...
  ];
  const [assigned, setAssigned] = useState(assignees[0]);
  const [labelled, setLabelled] = useState(labels[0]);
  const [dated, setDated] = useState(dueDates[0]);

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const handleStyleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((data) => ({
      ...data,
      style: {
        ...data.style,
        [field]: e.target.value,
      },
    }));
  };

  const getOptions = (data: any) =>
    Object.keys(data).reduce(
      (acc: any[], curr) => [
        ...acc,
        {
          name: curr.charAt(0).toUpperCase() + curr.slice(1).toLowerCase(),
          value: curr,
        },
      ],
      []
    );

  const colors = getOptions(colorMap);
  const emojis = getOptions(emojiMap);

  return (
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
                {recipient.profile.firstName} {recipient.profile.lastName}
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
            {profile.name}
          </h1>
        </div>
      </div>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-2 text-gray-500">
            <svg
              className="h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                fill="#6B7280"
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        <form action="#" className="relative">
          <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
            <label htmlFor="title" className="sr-only">
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              className="block w-full border-0 pt-2.5 text-lg font-medium placeholder-gray-500 focus:ring-0"
              placeholder="Title"
            />
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              rows={2}
              name="description"
              id="description"
              className="block w-full border-0 py-0 resize-none placeholder-gray-500 focus:ring-0 sm:text-sm"
              placeholder="Write a description..."
              defaultValue={""}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div aria-hidden="true">
              <div className="py-2">
                <div className="h-9" />
              </div>
              <div className="h-px" />
              <div className="py-2">
                <div className="py-px">
                  <div className="h-9" />
                </div>
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 inset-x-px">
            {/* Actions: These are just examples to demonstrate the concept, replace/wire these up however makes sense for your project. */}
            <div className="flex flex-nowrap justify-end py-2 px-2 space-x-2 sm:px-3">
              <Listbox
                as="div"
                value={formData?.style?.backgroundColor}
                name="backgroundColor"
                onChange={(e) => handleStyleChange(e, "backgroundColor")}
                className="flex-shrink-0"
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">BG Color</Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative inline-flex items-center rounded-full py-2 px-2 bg-gray-50 text-sm font-medium text-gray-500 whitespace-nowrap hover:bg-gray-100 sm:px-3">
                        {assigned.value === null ? (
                          <UserCircleIcon
                            className="flex-shrink-0 h-5 w-5 text-gray-300 sm:-ml-1"
                            aria-hidden="true"
                          />
                        ) : (
                          <img
                            src={assigned.avatar}
                            alt=""
                            className="flex-shrink-0 h-5 w-5 rounded-full"
                          />
                        )}

                        <span
                          className={classNames(
                            assigned.value === null ? "" : "text-gray-900",
                            "hidden truncate sm:ml-2 sm:block"
                          )}
                        >
                          {assigned.value === null ? "Assign" : assigned.name}
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute right-0 z-10 mt-1 w-52 bg-white shadow max-h-56 rounded-lg py-3 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {assignees.map((assignee) => (
                            <Listbox.Option
                              key={assignee.value}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-gray-100" : "bg-white",
                                  "cursor-default select-none relative py-2 px-3"
                                )
                              }
                              value={assignee}
                            >
                              <div className="flex items-center">
                                {assignee.avatar ? (
                                  <img
                                    src={assignee.avatar}
                                    alt=""
                                    className="flex-shrink-0 h-5 w-5 rounded-full"
                                  />
                                ) : (
                                  <UserCircleIcon
                                    className="flex-shrink-0 h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                )}

                                <span className="ml-3 block font-medium truncate">
                                  {assignee.name}
                                </span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>

              <Listbox
                as="div"
                value={labelled}
                onChange={setLabelled}
                className="flex-shrink-0"
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">
                      Add a label
                    </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative inline-flex items-center rounded-full py-2 px-2 bg-gray-50 text-sm font-medium text-gray-500 whitespace-nowrap hover:bg-gray-100 sm:px-3">
                        <TagIcon
                          className={classNames(
                            labelled.value === null
                              ? "text-gray-300"
                              : "text-gray-500",
                            "flex-shrink-0 h-5 w-5 sm:-ml-1"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={classNames(
                            labelled.value === null ? "" : "text-gray-900",
                            "hidden truncate sm:ml-2 sm:block"
                          )}
                        >
                          {labelled.value === null ? "Label" : labelled.name}
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute right-0 z-10 mt-1 w-52 bg-white shadow max-h-56 rounded-lg py-3 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {labels.map((label) => (
                            <Listbox.Option
                              key={label.value}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-gray-100" : "bg-white",
                                  "cursor-default select-none relative py-2 px-3"
                                )
                              }
                              value={label}
                            >
                              <div className="flex items-center">
                                <span className="block font-medium truncate">
                                  {label.name}
                                </span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>

              <Listbox
                as="div"
                value={dated}
                onChange={setDated}
                className="flex-shrink-0"
              >
                {({ open }) => (
                  <>
                    <Listbox.Label className="sr-only">
                      Add a due date
                    </Listbox.Label>
                    <div className="relative">
                      <Listbox.Button className="relative inline-flex items-center rounded-full py-2 px-2 bg-gray-50 text-sm font-medium text-gray-500 whitespace-nowrap hover:bg-gray-100 sm:px-3">
                        <CalendarIcon
                          className={classNames(
                            dated.value === null
                              ? "text-gray-300"
                              : "text-gray-500",
                            "flex-shrink-0 h-5 w-5 sm:-ml-1"
                          )}
                          aria-hidden="true"
                        />
                        <span
                          className={classNames(
                            dated.value === null ? "" : "text-gray-900",
                            "hidden truncate sm:ml-2 sm:block"
                          )}
                        >
                          {dated.value === null ? "Due date" : dated.name}
                        </span>
                      </Listbox.Button>

                      <Transition
                        show={open}
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                      >
                        <Listbox.Options className="absolute right-0 z-10 mt-1 w-52 bg-white shadow max-h-56 rounded-lg py-3 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                          {dueDates.map((dueDate) => (
                            <Listbox.Option
                              key={dueDate.value}
                              className={({ active }) =>
                                classNames(
                                  active ? "bg-gray-100" : "bg-white",
                                  "cursor-default select-none relative py-2 px-3"
                                )
                              }
                              value={dueDate}
                            >
                              <div className="flex items-center">
                                <span className="block font-medium truncate">
                                  {dueDate.name}
                                </span>
                              </div>
                            </Listbox.Option>
                          ))}
                        </Listbox.Options>
                      </Transition>
                    </div>
                  </>
                )}
              </Listbox>
            </div>
            <div className="border-t border-gray-200 px-2 py-2 flex justify-between items-center space-x-3 sm:px-3">
              <div className="flex">
                <button
                  type="button"
                  className="-ml-2 -my-2 rounded-full px-3 py-2 inline-flex items-center text-left text-gray-400 group"
                >
                  <PaperClipIcon
                    className="-ml-1 h-5 w-5 mr-2 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  <span className="text-sm text-gray-500 group-hover:text-gray-600 italic">
                    Attach a file
                  </span>
                </button>
              </div>
              <div className="flex-shrink-0">
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KudoModal;
