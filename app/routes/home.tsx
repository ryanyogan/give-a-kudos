import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { AuthenticatedLayout } from "~/components/authenticated-layout";
import { requireUserId } from "~/utils/auth.server";
import { getOtherUsers } from "~/utils/user.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const users = await getOtherUsers(userId);
  return json({ users });
};

const Home = () => {
  const { users } = useLoaderData();

  return (
    <AuthenticatedLayout users={users}>
      <Outlet />
    </AuthenticatedLayout>
  );
};

export default Home;
