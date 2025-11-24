'use client';

import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

interface Props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
  iconPosition?: "left" | "right";
}

export default function Search({
  placeholder,
  route,
  otherClasses,
  iconPosition,
  imgSrc,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);
  const [debouncedQuery] = useDebounce(searchQuery, 300);

  // URL update logic
  useEffect(() => {
    // Don't update if query hasn't changed
    if (debouncedQuery === query) return;

    let newUrl: string;

    if (debouncedQuery) {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "query",
        value: debouncedQuery,
      });
    } else {
      // Only remove query if we're on the target route
      if (pathname === route) {
        newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ["query"],
        });
      } else {
        return;
      }
    }

    // Only push if URL actually changed
    if (newUrl !== window.location.href) {
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, query, searchParams, router, pathname, route]);

  return (
    <div
      className={`bg-custom-muted flex min-h-14 grow items-center gap-4 rounded-[10px] px-4 ${otherClasses}`}>
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      {iconPosition === "left" && (
        <Image
          src={imgSrc}
          width={24}
          height={24}
          alt="Search"
          className="cursor-pointer"
        />
      )}
      <input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph-regular no-focus placeholder text-dark400_light700 border-none shadow-none outline-none"
      />
      {iconPosition === "right" && (
        <Image
          src={imgSrc}
          width={15}
          height={15}
          alt="Search"
          className="cursor-pointer"
        />
      )}
    </div>
  );
}