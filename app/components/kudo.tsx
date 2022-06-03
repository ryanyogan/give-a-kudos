import {
  AcademicCapIcon,
  BadgeCheckIcon,
  CashIcon,
  ClockIcon,
  ReceiptRefundIcon,
  UsersIcon,
} from "@heroicons/react/outline";
import type { Profile, Kudo as IKudo, User } from "@prisma/client";
import { backgroundColorMap, emojiMap } from "~/utils/constants";

const action = [
  {
    title: "Request time off",
    href: "#",
    icon: ClockIcon,
    iconForeground: "text-teal-700",
    iconBackground: "bg-teal-50",
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Kudo = ({
  profile,
  kudo,
  recipient,
  kudoIdx,
}: {
  profile: Profile;
  recipient: User;
  kudo: Partial<IKudo>;
  kudoIdx: number;
}) => {
  return (
    <div
      className={classNames(
        kudoIdx === 0 ? "rounded-tl-lg rounded-tr-lg sm:rounded-tr-none" : "",
        kudoIdx === 1 ? "sm:rounded-tr-lg" : "",
        kudoIdx === action.length - 2 ? "sm:rounded-bl-lg" : "",
        kudoIdx === action.length - 1
          ? "rounded-bl-lg rounded-br-lg sm:rounded-bl-none"
          : "",
        "relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
      )}
    >
      <div>
        <div
          className={classNames(
            backgroundColorMap[kudo?.style?.backgroundColor] || "bg-white",
            "bg-white p-6 rounded-full h-10 w-10 flex items-center justify-center text-2xl"
          )}
        >
          {emojiMap[kudo.style?.emoji || "THUMBSUP"]}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-lg font-medium">
          <a href={action.href} className="focus:outline-none">
            {/* Extend touch target to entire panel */}
            <span className="absolute inset-0" aria-hidden="true" />
            Dear, {recipient.profile.firstName}
          </a>
        </h3>
        <p className="mt-2 text-sm text-gray-500 whitespace-pre-wrap break-all">
          {kudo.message}
        </p>
        <p className="mt-8 text-xs text-gray-400 font-semibold">#you-rock</p>
      </div>
      <span
        className="pointer-events-none absolute top-6 right-6 text-gray-300 group-hover:text-gray-400"
        aria-hidden="true"
      >
        <svg
          className="h-6 w-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M20 4h1a1 1 0 00-1-1v1zm-1 12a1 1 0 102 0h-2zM8 3a1 1 0 000 2V3zM3.293 19.293a1 1 0 101.414 1.414l-1.414-1.414zM19 4v12h2V4h-2zm1-1H8v2h12V3zm-.707.293l-16 16 1.414 1.414 16-16-1.414-1.414z" />
        </svg>
      </span>
    </div>
  );
};
