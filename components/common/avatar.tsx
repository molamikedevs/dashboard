
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
  // Check if src is a valid non-empty string
  const isValidSrc = src && src.trim() !== "";

  if (isValidSrc) {
    return (
      <div
        className={`relative rounded-full overflow-hidden ${className}`}
        style={{ width: size, height: size }}>
        <Image
          src={src}
          fill
          className="object-cover"
          alt={alt}
          sizes={`${size}px`}
          aria-label={alt}
        />
      </div>
    );
  }

  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-gray-300 ${className}`}
      style={{ width: size, height: size }}
    >
      <User className={`text-gray-600 ${size <= 24 ? 'h-3 w-3' : 'h-4 w-4'}`} />
    </div>
  );
}