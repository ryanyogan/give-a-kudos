import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Index() {
  return (
    <div className="h-screen antialiased bg-gray-50 flex justify-center items-center">
      <h1 className="text-slate-800 text-xl font-semibold text-center">
        Hello World
      </h1>
    </div>
  );
}
