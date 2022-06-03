import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { getOtherUsers, getUserById } from "~/utils/user.server";
import { useState } from "react";
import { getUser, requireUserId } from "~/utils/auth.server";
import type { Color, Emoji, KudoStyle } from "@prisma/client";
import { MailIcon, PhoneIcon } from "@heroicons/react/solid";
import { SelectField } from "~/components/select-field";
import { backgroundColorMap, colorMap, emojiMap } from "~/utils/constants";
import { Kudo } from "~/components/kudo";
import { createKudo } from "~/utils/kudos.server";
import { AuthenticatedLayout } from "~/components/authenticated-layout";

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

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const message = form.get("message");
  const backgroundColor = form.get("backgroundColor");
  const textColor = form.get("textColor");
  const emoji = form.get("emoji");
  const recipientId = form.get("recipientId");

  if (
    typeof message !== "string" ||
    typeof recipientId !== "string" ||
    typeof backgroundColor !== "string" ||
    typeof textColor !== "string" ||
    typeof emoji !== "string"
  ) {
    return json({ error: `Invalid Form Data` }, { status: 400 });
  }
  if (!message.length) {
    return json({ error: `Please provide a message.` }, { status: 400 });
  }
  if (!recipientId.length) {
    return json({ error: `No recipient found...` }, { status: 400 });
  }

  await createKudo(message, userId, recipientId, {
    backgroundColor: backgroundColor as Color,
    textColor: textColor as Color,
    emoji: emoji as Emoji,
  });

  return redirect("/home");
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { userId } = params;

  if (typeof userId !== "string") {
    return redirect("/home");
  }

  const recipient = await getUserById(userId);
  const user = await getUser(request);
  const users = await getOtherUsers(userId);
  return json({ recipient, user, users });
};

const UserPage = () => {
  const { users, kudos, user, recipient } = useLoaderData();
  const actionData = useActionData();
  const [formError] = useState(actionData?.error || "");
  const [formData, setFormData] = useState({
    message: "",
    style: {
      backgroundColor: "WHITE",
      textColor: "WHITE",
      emoji: "THUMBSUP",
    } as KudoStyle,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    setFormData((data) => ({ ...data, [field]: e.target.value }));
  };

  function classNames(...classes: any[]) {
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
    Object.keys(data).reduce((acc: any[], curr) => {
      acc.push({
        name: curr.charAt(0).toUpperCase() + curr.slice(1).toLowerCase(),
        value: curr,
      });
      return acc;
    }, []);

  const emojis = getOptions(emojiMap);
  const colors = getOptions(backgroundColorMap);

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
              {user.profile.firstName} {user.profile.lastName}
            </h1>
          </div>
        </div>

        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mt-5">
          <form method="post" className="relative">
            <input type="hidden" value={recipient.id} name="recipientId" />
            <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500">
              <label htmlFor="title" className="sr-only">
                Title
              </label>
              <h1 className="block w-full border-0 bg-white ml-1 pt-2.5 p-2 text-lg font-medium placeholder-gray-500 focus:ring-0">
                Give Kudos!
              </h1>
              <label htmlFor="message" className="sr-only">
                Message
              </label>
              <textarea
                rows={4}
                name="message"
                id="message"
                onChange={(e) => handleChange(e, "message")}
                className="block w-full border-0 py-0 resize-none placeholder-gray-500 focus:ring-0 sm:text-sm"
                placeholder={`Write something nice about ${recipient.profile.firstName}...`}
                value={formData.message}
              />

              {/* Spacer element to match the height of the toolbar */}
              <div aria-hidden="true">
                <div className="py-2 border-b border-gray-300">
                  <br />
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
              <div className="flex flex-nowrap bg-white justify-start py-2 px-2 space-x-2 sm:px-3">
                {/* Emoji Here */}
                <SelectField
                  options={emojis}
                  name="emoji"
                  value={formData?.style?.emoji}
                  onChange={(e) => handleStyleChange(e, "emoji")}
                  label="Emoji"
                />
                <SelectField
                  options={colors}
                  name="textColor"
                  value={formData?.style?.textColor}
                  onChange={(e) => handleStyleChange(e, "textColor")}
                  label="Text Color"
                />
                <SelectField
                  options={colors}
                  name="backgroundColor"
                  value={formData?.style?.backgroundColor}
                  onChange={(e) => handleStyleChange(e, "backgroundColor")}
                  label="B.G. Color"
                />
              </div>
              <div className="border-t border-gray-200 px-2 py-2 flex justify-between items-center space-x-3 sm:px-3">
                <div className="flex"></div>
                <div className="flex-shrink-0">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          </form>

          <div className="relative my-8">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-2 text-gray-600 font-bold text-sm">
                <span>Kudo Preview</span>
              </span>
            </div>
          </div>

          <Kudo profile={user.profile} recipient={recipient} kudo={formData} />

          <div className="relative mt-5 mb-2">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-gray-50 px-2 text-gray-500 font-bold text-sm">
                <span>Recent Kudos</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
};

export default UserPage;
