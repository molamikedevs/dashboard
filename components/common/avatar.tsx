import Image from "next/image";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string | null;
  alt: string;
  name?: string;
  size?: number;
  className?: string;
}

export function Avatar({ src, alt, size = 28, className = "" }: AvatarProps) {
  const isValidSrc = src && src.trim() !== "";

  if (isValidSrc) {
    return (
      <div
        className={`relative rounded-full overflow-hidden shrink-0 ${className}`}
        style={{ width: size, height: size }}>
        <Image
          src={src}
          alt={alt}
          width={size}
          height={size}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-gray-300 shrink-0 ${className}`}
      style={{ width: size, height: size }}>
      <User className={`text-gray-600 ${size <= 24 ? "h-3 w-3" : "h-4 w-4"}`} />
    </div>
  );
}
