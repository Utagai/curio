type SubmitButtonProps = {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
};

export default function SubmitButton({
  onClick,
  disabled = false,
  children,
}: SubmitButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-6 py-2 bg-pink-400 text-pink-500 font-bold rounded-lg border-2 border-pink-500 hover:bg-pink-500 hover:border-pink-600 hover:text-white disabled:bg-gray-600 disabled:border-gray-700 disabled:cursor-not-allowed transition-colors"
    >
      {children}
    </button>
  );
}
