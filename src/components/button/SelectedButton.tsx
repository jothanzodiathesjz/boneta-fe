type ButtonProps = {
  className?: string;
  selected: boolean;
  onEvent?: (event: any) => void;
  children?: React.ReactNode;
};

export const SelectedButton = ({
  className,
  onEvent,
  selected,
  children,
}: ButtonProps) => (
  <button
    className={`p-3 rounded-xl px-5 shadow-md ${className} ${selected ? "bg-[#9C3131] text-white" : "bg-white text-[#747272]"}`}
    onClick={onEvent}
  >
    {children}
  </button>
);
