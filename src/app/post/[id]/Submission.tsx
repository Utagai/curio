type SubmissionProps = {
  submittedBy: string;
  date: Date;
  message: string;
  blobKey: string;
};

export default function Submission({
  submittedBy,
  date,
  message,
  blobKey,
}: SubmissionProps) {
  return (
    <div className="bg-gray-800 py-2 flex items-center">
      <img
        src={`/api/post/image?blobKey=${blobKey}`}
        alt="Not Found"
        className="w-24 h-24 bg-gray-700 mr-6 rounded-lg object-cover"
      />
      <div>
        <h4 className="text-lg md:text-xl mb-2 font-semibold">
          Found by {submittedBy}
        </h4>
        <p className="text-gray-300 mb-2 text-sm md:text-base">{message}</p>
        <p className="text-gray-400 text-xs md:text-sm">
          {date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
    </div>
  );
}
