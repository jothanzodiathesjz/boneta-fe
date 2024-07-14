export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  icon?: string;
  text?: string;
  onEvent?: (event: any) => void;
  disabled?: boolean;
}

export const MainButton = ({
  variant = 'primary',
  className = '',
  onEvent,
  icon,
  text,
  disabled = false,
}: ButtonProps) => {
  return (
    <button
      type="button"
      className={`rounded-xl px-5 shadow-md flex justify-center items-center gap-2 py-3 ${
        variant === 'primary'
          ? 'bg-[#9C3131] text-neutral-100'
          : variant === 'secondary'
          ? 'bg-white border-gray-300 text-gray-700 hover:scale-105'
          : 'bg-warning-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
      } ${className}` }
      onClick={onEvent}
      disabled={disabled } 
    >
     { icon && <span className="material-icons">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};
