import Image from "next/image";

type LoadingIndicatorProps = {
  message?: string;
  size?: number;
};

export default function LoadingIndicator({
  message = "Loading...",
  size = 48,
}: LoadingIndicatorProps) {
  return (
    <div className="flex items-center justify-center h-full bg-gray-800">
      <div className="text-center">
        <div className="animate-bounce mb-2">
          <Image
            src="/logo.svg"
            alt="Curio Logo"
            width={size}
            height={size}
            className="mx-auto"
          />
        </div>
        <p className="text-gray-300 text-lg">{message}</p>
      </div>
    </div>
  );
}

