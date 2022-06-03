interface props {
  options: {
    name: string;
    value: any;
  }[];
  className?: string;
  containerClassName?: string;
  id?: string;
  name?: string;
  label?: string;
  value?: any;
  onChange?: (...args: any) => any;
}
export const SelectField = ({
  options = [],
  onChange = () => {},
  className = "",
  containerClassName = "",
  name,
  id,
  value,
  label,
}: props) => {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-gray-400">
        {label}
      </label>
      <select
        id={id}
        name={name}
        onChange={onChange}
        value={value || ""}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
      >
        {options.map((option) => (
          <option key={option.name} value={option.value}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};
