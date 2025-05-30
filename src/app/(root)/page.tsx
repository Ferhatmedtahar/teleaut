import { getSearchResults } from "@/actions/home/homeVideos.action";
import HomePage from "@/components/home/HomePage";
import { SearchResultsClient } from "@/components/SearchResults";

interface SearchPageProps {
  readonly searchParams: Promise<{ query?: string; filter?: string }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const activeFilter = params.filter ?? "tout";

  console.log("Search Page Params:", { query, activeFilter });

  //! If no search query, show home page with all videos
  if (!query) {
    return <HomePage />;
  }

  // Get search results
  const {
    success,
    videos: searchVideos,
    teachers: searchTeachers,
    students: searchStudents,
  } = await getSearchResults(query);

  if (!success) {
    return (
      <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium mb-2">Erreur de recherche</h3>
          <p className="text-muted-foreground">
            Impossible d&apos;effectuer la recherche. Veuillez réessayer plus
            tard.
          </p>
        </div>
      </div>
    );
  }

  console.log("Search Results:", {
    query,
    activeFilter,
    searchVideos,
    searchTeachers,
    searchStudents,
  });
  return (
    <SearchResultsClient
      query={query}
      activeFilter={activeFilter}
      initialVideos={searchVideos}
      searchTeachers={searchTeachers}
      searchStudents={searchStudents}
    />
  );
}
