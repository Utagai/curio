type SubmitButtonProps = {
  onClick: (e?: React.FormEvent) => void;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "button" | "submit";
  isLoading?: boolean;
};

export default function SubmitButton({
  onClick,
  disabled = false,
  children,
  type = "button",
  isLoading = false,
}: SubmitButtonProps) {
  const spinner = (
    <div className="flex items-center justify-center">
      <svg
        className="animate-spin h-5 w-5 text-pink-200"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2 bg-pink-400 text-white font-bold rounded-lg border-2 border-pink-500 hover:bg-pink-500 hover:border-pink-600 hover:text-white disabled:bg-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed transition-colors"
    >
      {isLoading ? spinner : children}
    </button>
  );
}
