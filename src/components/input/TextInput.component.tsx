import { useState, useEffect } from "react";

export default function TextInput({
  label,
  id,
  type = "text",
  value,
  icon,
  onChange,
  placeholder,
  disabled = false,
  debounce, // Default debounce delay (300ms). Set to 0 to disable debounce.
}: {
  label?: string;
  id: string;
  type?: string;
  icon?: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  debounce?: number; // New prop for debounce delay
}) {
  const [focused, setFocused] = useState(false);
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    if (debounce) {
      const handler = setTimeout(() => {
        if (debouncedValue !== value) {
          onChange &&
            onChange({
              target: { value: debouncedValue },
            } as React.ChangeEvent<HTMLInputElement>);
        }
      }, debounce); // Use debounce delay

      return () => {
        clearTimeout(handler);
      };
    } else {
      onChange &&
        onChange({
          target: { value: debouncedValue },
        } as React.ChangeEvent<HTMLInputElement>);
    }
  }, [debouncedValue, value, onChange, debounce]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  return (
    <div
      className={
        "flex flex-row bg-white items-center px-3 py-2 rounded-xl shadow-md" +
        (focused ? " border-2 border-primary" : "") +
        (disabled ? "  bg-[#FAFAFA]" : "")
      }
    >
      {icon && <span className="material-icons text-[#747272]">{icon}</span>}
      <input
        type={type}
        id={id}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="border-none bg-transparent focus:border-none focus:outline-none focus:shadow-none focus:ring-0 w-full p-3 text-[#747272]"
        value={debouncedValue}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
      />
    </div>
  );
}
