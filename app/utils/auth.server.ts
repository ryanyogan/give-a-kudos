import { createCookieSessionStorage, json, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import type { LoginForm, RegisterForm } from "./types.server";
import { createUser } from "./user.server";
import bcrypt from "bcryptjs";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET ENV must be set.");
}

const storage = createCookieSessionStorage({
  cookie: {
    name: "kudos-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};

export const register = async (user: RegisterForm) => {
  const userExists = await prisma.user.count({ where: { email: user.email } });
  if (userExists) {
    return json(
      { error: "User already exists with that email" },
      { status: 400 }
    );
  }

  const newUser = await createUser(user);
  if (!newUser) {
    return json(
      {
        error: "Something went wrong when creating the user",
        fields: { email: user.email, password: user.password },
      },
      { status: 400 }
    );
  }

  return createUserSession(newUser.id, "/");
};

export const login = async ({ email, password }: LoginForm) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return json({ error: "Incorrect Login" }, { status: 400 });
  }

  return createUserSession(user.id, "/");
};
