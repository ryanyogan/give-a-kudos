import type { Profile } from "@prisma/client";
import { people } from "./user-panel";

interface props {
  profile: Profile;
  className?: string;
  onClick?: (...args: any) => any;
}

export const UserPanelRow = ({ profile, onClick, className }: props) => {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex-shrink-0">
        <img className="h-8 w-8 rounded-full" src={people[0].imageUrl} alt="" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {profile.firstName} {profile.lastName}
        </p>
        <p className="text-sm text-gray-500 truncate">{profile.handle}</p>
      </div>
      <div>
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center shadow-sm px-2.5 py-0.5 border border-gray-300 text-sm leading-5 font-medium rounded-full text-gray-700 bg-white hover:bg-gray-50"
        >
          Send Kudos!
        </button>
      </div>
    </div>
  );
};
