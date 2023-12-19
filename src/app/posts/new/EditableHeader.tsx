export default function EditableHeader(props: { placeholder: string }) {
  // NOTE: For some reason, white-space-nowrap doesn't work here.
  return (
    <textarea
      className="editable text-4xl font-bold bg-gray-700 p-2 mx-2 rounded-lg resize-none overflow-hidden"
      rows={1}
      placeholder={props.placeholder}
      style={{
        whiteSpace: "nowrap",
      }}
    ></textarea>
  );
}