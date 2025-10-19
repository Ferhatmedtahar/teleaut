export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header Skeleton */}
      <div className="bg-white dark:bg-background/80 border-b px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-background/70 animate-pulse" />
        <div className="flex-1">
          <div className="h-4 bg-gray-200 dark:bg-background/70 rounded w-32 mb-2 animate-pulse" />
          <div className="h-3 bg-gray-200  dark:bg-background/70 rounded w-20 animate-pulse" />
        </div>
      </div>

      {/* Messages Skeleton */}
      <div className="flex-1 p-4 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                i % 2 === 0
                  ? "bg-blue-100 dark:bg-blue-800"
                  : "bg-gray-200 dark:bg-background/70"
              } animate-pulse`}
            >
              <div className="h-4 bg-gray-300 dark:bg-background/70 rounded w-48 mb-2" />
              <div className="h-3 bg-gray-300 dark:bg-background/70 rounded w-20" />
            </div>
          </div>
        ))}
      </div>

      {/* Input Skeleton */}
      <div className="border-t bg-white dark:bg-background/80 p-4">
        <div className="h-10 bg-gray-200 dark:bg-background/60 rounded-full animate-pulse" />
      </div>
    </div>
  );
}
