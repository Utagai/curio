type SubmitButtonProps = { onClick: () => void };

export default function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button
      className="btn-submit btn-submit:hover text-white font-bold py-2 px-4 rounded"
      onClick={onClick}
    >
      Submit
    </button>
  );
}
