export default function VideoSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
      <div className="lg:col-span-2">
        {/* Video player skeleton */}
        <div className="w-full aspect-video bg-gray-200 dark:bg-primary-700/30 rounded-lg mb-4"></div>

        {/* Video info skeleton */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 dark:bg-primary-700/30 rounded w-3/4 mb-4"></div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-primary-700/30"></div>
              <div>
                <div className="h-4 bg-gray-200 dark:bg-primary-700/30 rounded w-24 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-16"></div>
              </div>
            </div>
            <div className="ml-auto flex gap-2">
              <div className="h-8 bg-gray-200 dark:bg-primary-700/30 rounded w-16"></div>
              <div className="h-8 bg-gray-200 dark:bg-primary-700/30 rounded w-16"></div>
            </div>
          </div>

          <div className="h-px bg-gray-200 dark:bg-primary-700/30 w-full mt-4" />
        </div>

        {/* Description skeleton */}
        <div className="mb-8 bg-gray-100 dark:bg-primary-700 p-4 rounded-lg">
          <div className="h-4 bg-gray-200  dark:bg-primary-700/30 rounded w-1/4 mb-4"></div>
          <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-full mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-3/4"></div>
        </div>

        {/* Comments skeleton */}
        <div className="mb-8">
          <div className="h-6 bg-gray-200  dark:bg-primary-700/30 rounded w-1/4 mb-6"></div>

          <div className="flex gap-4 mb-6">
            <div className="w-full h-24 bg-gray-200 dark:bg-primary-700/30 rounded"></div>
          </div>

          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex gap-4 mb-6">
              <div className="w-10 h-10 rounded-full dark:bg-primary-700/30  bg-gray-200"></div>
              <div className="flex-1">
                <div className="flex gap-2 mb-2">
                  <div className="h-4 bg-gray-200 dark:bg-primary-700/30  rounded w-24"></div>
                  <div className="h-4 bg-gray-200 dark:bg-primary-700/30  rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-primary-700/30  rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-full mb-1"></div>
                <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        {/* Documents tab skeleton */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 mb-2">
            <div className="h-10 bg-gray-200 dark:bg-primary-700/30 rounded"></div>
            <div className="h-10 bg-gray-200 dark:bg-primary-700/30 rounded"></div>
          </div>
          <div className="h-40 bg-gray-100 rounded-b-lg border dark:bg-primary-700 border-gray-200"></div>
        </div>

        {/* Related videos skeleton */}
        <div>
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>

          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-3 mb-4">
              <div className="w-32 h-20 bg-gray-200 dark:bg-primary-700/30 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-primary-700/30 rounded w-full mb-2"></div>
                <div className="h-3 bg-gray-200  dark:bg-primary-700/30 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-primary-700/30 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
