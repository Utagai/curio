export default function Submission(props: {
  submittedBy: string;
  date: Date;
  message: string;
  imageUri: string;
}) {
  return (
    <div className="bg-gray-800 p-2 rounded-lg shadow-drop flex items-center">
      <img
        src={props.imageUri}
        alt="placeholder"
        className="w-24 h-24 bg-gray-700 mr-4"
      />
      <div>
        <h4 className="text-base md:text-lg mb-1">
          found by {props.submittedBy}
        </h4>
        <p className="text-gray-400 mb-1 text-xs md:text-sm">{props.message}</p>
        <p className="text-gray-500 text-xs md:text-sm">
          {props.date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
