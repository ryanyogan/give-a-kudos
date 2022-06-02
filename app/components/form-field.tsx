import { useEffect, useState } from "react";

interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  required?: boolean;
  onChange?: (...args: any) => any;
  error?: string;
}

export const FormField = ({
  htmlFor,
  label,
  type = "text",
  value,
  required = false,
  onChange = () => {},
  error = "",
}: FormFieldProps) => {
  const [errorText, setErrorText] = useState(error);

  useEffect(() => {
    setErrorText(error);
  }, [error]);

  return (
    <>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="mt-1">
        <input
          id={htmlFor}
          name={htmlFor}
          type={type}
          required={required}
          value={value}
          onChange={(e) => {
            onChange(e);
            setErrorText("");
          }}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
        <div className="text-xs font-bold text-red-600 tracking-wide w-full mt-2">
          {errorText || ""}
        </div>
      </div>
    </>
  );
};
