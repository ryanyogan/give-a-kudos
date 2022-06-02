import { useState } from "react";
import { FormField } from "~/components/form-field";
import { Layout } from "~/components/layout";

const actions = {
  login: "login",
  register: "register",
};

const Login = () => {
  const [action, setAction] = useState(actions.login);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });

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
            {action === actions.login
              ? "Log In To Give Some Praise"
              : "Sign Up To Give Some Praise"}
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" method="POST">
              <div>
                <FormField
                  htmlFor="email"
                  label="Email Address"
                  value={formData.email}
                  required
                  onChange={(e) => handleInputChange(e, "email")}
                />
              </div>

              <div>
                <FormField
                  htmlFor="password"
                  label="Password"
                  required
                  value={formData.password}
                  onChange={(e) => handleInputChange(e, "password")}
                />
              </div>

              {action === actions.register && (
                <>
                  <div>
                    <FormField
                      htmlFor="firstName"
                      label="First Name"
                      onChange={(e) => handleInputChange(e, "firstName")}
                      value={formData.firstName}
                    />
                  </div>

                  <div>
                    <FormField
                      htmlFor="lastName"
                      label="Last Name"
                      onChange={(e) => handleInputChange(e, "lastName")}
                      value={formData.lastName}
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
                  {action === actions.login ? "Sign in" : "Register"}
                </button>
              </div>
            </form>
          </div>
        </div>
        <button
          onClick={(e) =>
            setAction(
              action === actions.login ? actions.register : actions.login
            )
          }
          className="mt-2 text-center text-xs font-bold text-blue-600 transition duration-300 ease-in-out underline cursor-pointer hover:text-blue-400"
        >
          {action === actions.login ? (
            <span>or register</span>
          ) : (
            <span>or login</span>
          )}
        </button>
      </div>
    </Layout>
  );
};

export { Login as default };
