"use client";

import { X } from "lucide-react";
import Link from "next/link";

const SearchFormReset = ({
  setSearch,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const reset = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const form = e.currentTarget.closest("form") as HTMLFormElement;
    setSearch("");
    if (form) form.reset();
  };

  return (
    <button aria-label="Reset the form" type="reset" onClick={reset}>
      <Link
        href="/"
        className="search-btn text-primary-600 hover:text-primary-700 dark:text-primary-50 dark:hover:text-primary-100 transition-colors"
      >
        <X className="size-5" />
      </Link>
    </button>
  );
};
export default SearchFormReset;
