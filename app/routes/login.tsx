import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useActionData } from "@remix-run/react";
import { useEffect, useRef, useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";
import { getUser, login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";
import { XCircleIcon } from "@heroicons/react/solid";

export const loader: LoaderFunction = async ({ request }) => {
  return (await getUser(request)) ? redirect("/") : null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("_action");
  const email = form.get("email");
  const password = form.get("password");
  let firstName = form.get("firstName");
  let lastName = form.get("lastName");
  let handle = form.get("handle");

  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string) || ""),
          lastName: validateName((lastName as string) || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }

  switch (action) {
    case "login": {
      return await login({ email, password });
    }

    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;
      handle = handle as string;
      return await register({ email, password, firstName, lastName, handle });
    }

    default:
      return json({ error: "Invalid Form Data" }, { status: 400 });
  }
};

const Login = () => {
  const actionData = useActionData();
  const firstLoad = useRef(true);
  const [errors, setErrors] = useState(actionData?.errors || {});
  const [formError, setFormError] = useState(actionData?.error || "");
  const [action, setAction] = useState("login");
  const [formData, setFormData] = useState({
    email: actionData?.fields?.email || "",
    password: actionData?.fields?.password || "",
    firstName: actionData?.fields?.firstName || "",
    lastName: actionData?.fields?.lastName || "",
    handle: actionData?.fields?.handle || "",
  });

  useEffect(() => {
    if (!firstLoad.current) {
      const newState = {
        email: "",
        password: "",
        firstName: "",
        lastName: "",
        handle: "",
      };
      setErrors(newState);
      setFormError("");
      setFormData(newState);
    }
  }, [action]);

  useEffect(() => {
    if (!firstLoad.current) {
      setFormError("");
    }
  }, [formData]);

  useEffect(() => {
    firstLoad.current = false;
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({ ...form, [field]: e.target.value }));
  };

  return (
    <Layout>
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img
            className="mx-auto h-12 w-auto"
            src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
            alt="Workflow"
          />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Welcome to Kudos!
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {action === "login"
              ? "Log In To Give Some Praise"
              : "Sign Up To Give Some Praise"}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" method="POST">
              {Object.values(errors).filter((v) => v !== "").length !== 0 && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <XCircleIcon
                        className="h-5 w-5 text-red-400"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        There were {Object.keys(errors).length} errors with your
                        submission
                      </h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul role="list" className="list-disc pl-5 space-y-1">
                          {Object.values(errors).map((error) => (
                            <li key={error as string}>{error as string}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <FormField
                  htmlFor="email"
                  label="Email Address"
                  value={formData.email}
                  required
                  onChange={(e) => handleInputChange(e, "email")}
                  error={errors?.email}
                />
              </div>

              <div>
                <FormField
                  htmlFor="password"
                  label="Password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                  error={errors?.password}
                />
              </div>

              {action === "register" && (
                <>
                  <div>
                    <FormField
                      htmlFor="firstName"
                      label="First Name"
                      onChange={(e) => handleInputChange(e, "firstName")}
                      value={formData.firstName}
                      error={errors?.firstName}
                    />
                  </div>

                  <div>
                    <FormField
                      htmlFor="lastName"
                      label="Last Name"
                      onChange={(e) => handleInputChange(e, "lastName")}
                      value={formData.lastName}
                      error={errors?.lastName}
                    />
                  </div>

                  <div>
                    <FormField
                      htmlFor="handle"
                      label="Twitter/Github Handle"
                      onChange={(e) => handleInputChange(e, "handle")}
                      value={formData.handle}
                      error={errors?.handle}
                    />
                  </div>
                </>
              )}

              <div>
                <button
                  type="submit"
                  name="_action"
                  value={action}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {action === "login" ? "Sign in" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <button
          onClick={(e) => setAction(action === "login" ? "register" : "login")}
          className="mt-2 text-center text-xs font-bold text-blue-600 transition duration-300 ease-in-out underline cursor-pointer hover:text-blue-400"
        >
          {action === "login" ? (
            <span>or register</span>
          ) : (
            <span>or login</span>
          )}
        </button>
      </div>
    </Layout>
  );
};

export default Login;
