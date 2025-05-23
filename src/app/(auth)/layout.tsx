import React from "react";
import Background from "./_components/background";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col lg:flex-row bg-gray-50 dark:bg-background ">
      <Background />
      <main className="w-full lg:w-1/2 ">{children}</main>
    </div>
  );
}
