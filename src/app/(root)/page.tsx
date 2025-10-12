// import { getSearchResults } from "@/actions/home/homeVideos.action";
// import HomePage from "@/components/home/HomePage";
// import { SearchResultsClient } from "@/components/home/SearchResults";

// interface SearchPageProps {
//   readonly searchParams: Promise<{ query?: string; filter?: string }>;
// }

// export default async function Page({ searchParams }: SearchPageProps) {
//   const params = await searchParams;
//   const query = params.query ?? "";
//   const activeFilter = params.filter ?? "tout";

//   //! If no search query, show home page with all videos
//   if (!query) {
//     return <HomePage />;
//   }

//   const {
//     success,
//     videos: searchVideos,
//     teachers: searchTeachers,
//     students: searchStudents,
//   } = await getSearchResults(query);

//   if (!success) {
//     return (
//       <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
//         <div className="text-center py-12">
//           <h3 className="text-lg font-medium mb-2">Erreur de recherche</h3>
//           <p className="text-muted-foreground">
//             Impossible d&apos;effectuer la recherche. Veuillez réessayer plus
//             tard.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <SearchResultsClient
//       query={query}
//       activeFilter={activeFilter}
//       initialVideos={searchVideos}
//       searchTeachers={searchTeachers}
//       searchStudents={searchStudents}
//     />
//   );
// }

import { getCurrentUser } from "@/actions/auth/getCurrentUser.action";
// import { getSearchResults } from "@/actions/home/homeVideos.action";
import { Button } from "@/components/common/buttons/Button";
import GuestHomePage from "@/components/home/GuestHomePage";
import HomePage from "@/components/home/HomePage";
import Link from "next/link";

interface SearchPageProps {
  readonly searchParams: Promise<{
    query?: string;
    filter?: string;
    search?: string;
  }>;
}

export default async function Page({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.query ?? "";
  const search = params.search ?? "";
  const activeFilter = params.filter ?? "tout";

  const result = await getCurrentUser();
  const isAuthenticated = result.success && result.user;
  if (!isAuthenticated) {
    if (query) {
      return (
        <div className="space-y-6 dark:bg-background/80 bg-background/80 p-6 rounded-lg min-h-screen">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">Connexion requise</h3>
            <p className="text-muted-foreground mb-4">
              Vous devez vous connecter pour effectuer une recherche.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/sign-in">
                <Button variant="default">Se connecter</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline">S&apos;inscrire</Button>
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return <GuestHomePage />;
  }

  // For authenticated users
  // If no search query, show home page with all videos
  if (!query) {
    return <HomePage />;
  }
}
