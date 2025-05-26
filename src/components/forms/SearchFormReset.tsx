"use client";

import { X } from "lucide-react";
import Link from "next/link";

const SearchFormReset = () => {
  const reset = () => {
    const form = document.querySelector(".search-form") as HTMLFormElement;

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
