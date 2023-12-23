export default function SubmitButton(props: { onClick: () => void }) {
  return (
    <button
      className="btn-submit btn-submit:hover text-white font-bold py-2 px-4 rounded"
      onClick={props.onClick}
    >
      Submit
    </button>
  );
}
