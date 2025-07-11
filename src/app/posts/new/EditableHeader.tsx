type EditableHeaderProps = {
  placeholder: string;
  onChange: (value: string) => void;
};

export default function EditableHeader({ placeholder, onChange }: EditableHeaderProps) {
  // NOTE: For some reason, white-space-nowrap doesn't work here.
  return (
    <textarea
      className="editable max-w-full text-4xl font-bold bg-gray-700 p-2 mr-2 rounded-lg resize-none overflow-hidden"
      rows={1}
      placeholder={placeholder}
      style={{
        whiteSpace: "nowrap",
      }}
      onChange={(e) => onChange(e.target.value)}
    ></textarea>
  );
}
