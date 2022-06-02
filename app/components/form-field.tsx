interface FormFieldProps {
  htmlFor: string;
  label: string;
  type?: string;
  value: any;
  required?: boolean;
  onChange?: (...args: any) => any;
}

export const FormField = ({
  htmlFor,
  label,
  type = "text",
  value,
  required = false,
  onChange = () => {},
}: FormFieldProps) => {
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
          onChange={onChange}
          className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
    </>
  );
};
