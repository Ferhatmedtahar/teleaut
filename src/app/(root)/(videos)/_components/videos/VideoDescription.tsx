export default function VideoDescription({
  description,
}: {
  readonly description: string | null;
}) {
  if (!description) {
    return null;
  }

  return (
    <>
      <div className="   flex flex-col gap-2">
        <h2 className="text-2xl font-semibold ">Description</h2>
        <p className=" text-primary-900  dark:text-primary-50 whitespace-pre-line text-sm">
          {description}
        </p>
      </div>
      <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
    </>
  );
}
