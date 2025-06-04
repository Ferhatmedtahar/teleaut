// "use client";

import { getVideosGuestPage } from "@/actions/home/getHomeVideo";
import ExplorerVideo from "@/app/(root)/(videos)/_components/videos/ExplorerVideo";
import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Play, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// Types for video data
interface Teacher {
  id: string;
  first_name?: string;
  last_name?: string;
  profile_url?: string;
}

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  subject: string;
  class?: string;
  branch?: string[];
  teacher?: Teacher;
  views?: number;
  created_at?: string;
  teacher_id?: string;
}

function getTeacherName(teacher?: {
  first_name?: string;
  last_name?: string;
}): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
    "Professeur"
  );
}

export default async function GuestHomePage() {
  // Fetch latest videos using your getRelatedVideos function
  // We'll use a dummy video ID and get fallback (latest) videos
  const { success, videos } = await getVideosGuestPage();

  if (!success || !videos || (Array.isArray(videos) && videos.length === 0)) {
    return null;
  }

  // Separate featured video (first one) from explorer videos
  const featuredVideo = videos.length > 0 ? videos[0] : null;
  const explorerVideos = videos.length > 1 ? videos.slice(1) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      {/* Hero Section */}
      <section className="px-4 py-20 md:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Bienvenue sur{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Cognacia
            </span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
            Découvrez une plateforme d&apos;apprentissage innovante où
            enseignants et étudiants se connectent pour partager des
            connaissances et créer un avenir meilleur.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up/info">
              <Button size="lg" className="w-full sm:w-auto">
                Commencer gratuitement
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Se connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Videos Section */}
      {!success ? (
        <section className="px-4 py-16 md:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <div className="text-center py-12">
              <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
              <p className="text-muted-foreground">
                Impossible de charger les vidéos. Veuillez réessayer plus tard.
              </p>
            </div>
          </div>
        </section>
      ) : (
        <section className="px-4 py-16 md:px-6 lg:px-10">
          <div className="mx-auto max-w-6xl space-y-12">
            {/* Featured Video */}
            {featuredVideo && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Vidéo en vedette</h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="grid md:grid-cols-2 gap-4 p-6">
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
                        <Link href="/sign-in">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Button
                              size="icon"
                              variant="outline"
                              className="hover:cursor-pointer rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
                            >
                              <Play className="h-8 w-8" />
                            </Button>
                          </div>
                          <Image
                            src={
                              featuredVideo.thumbnail_url ??
                              "/images/placeholder-thumbnail.jpg"
                            }
                            height={300}
                            width={500}
                            alt="Featured video"
                            className="object-cover w-full h-full"
                          />
                        </Link>
                      </div>
                      <div className="flex flex-col justify-between">
                        <div>
                          <h3 className="text-xl font-bold">
                            {featuredVideo.title}
                          </h3>
                          <p className="text-muted-foreground mt-2">
                            {featuredVideo.description}
                          </p>
                          <div className="flex gap-2">
                            <div className="text-xs mt-2">
                              <div className="flex flex-col items-center gap-2">
                                <div className="flex items-center gap-2">
                                  <p>
                                    {featuredVideo.class && (
                                      <span className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
                                        {featuredVideo.class}
                                      </span>
                                    )}
                                  </p>
                                  <p className="px-2 py-1 w-fit bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
                                    {featuredVideo.subject}
                                  </p>
                                </div>

                                {featuredVideo.branch &&
                                  featuredVideo.branch?.length > 0 && (
                                    <span className="font-medium">
                                      {featuredVideo.branch.length > 0 && (
                                        <p className="w-fit px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
                                          {featuredVideo.branch[0]}
                                          {featuredVideo.branch.length > 1 &&
                                            `... +${
                                              featuredVideo.branch.length - 1
                                            }`}
                                        </p>
                                      )}
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={
                                featuredVideo.teacher?.profile_url ??
                                "/images/placeholder-profile.png"
                              }
                              alt={getTeacherName(featuredVideo.teacher)}
                            />
                            <AvatarFallback>
                              {getTeacherName(featuredVideo.teacher).charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">
                              {getTeacherName(featuredVideo.teacher)}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @
                              {getTeacherName(featuredVideo.teacher)
                                .toLowerCase()
                                .replace(" ", "")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Explorer Videos */}
            {explorerVideos.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold mb-6">Dernières vidéos</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {explorerVideos.map((video) => (
                    <ExplorerVideo
                      key={video.id}
                      video={video}
                      user={video.teacher}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="px-4 py-16 md:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Pourquoi choisir Cognacia ?
          </h2>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Contenu Vidéo</h3>
              <p className="text-muted-foreground">
                Accédez à des milliers de vidéos éducatives créées par des
                experts.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Communauté</h3>
              <p className="text-muted-foreground">
                Rejoignez une communauté d&apos;apprenants et d&apos;enseignants
                passionnés.
              </p>
            </div>

            <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
              <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Apprentissage</h3>
              <p className="text-muted-foreground">
                Apprenez à votre rythme avec des outils d&apos;apprentissage
                modernes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-16 md:px-6 lg:px-10 bg-muted/30">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-8 md:grid-cols-3 text-center">
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">100+</div>
              <div className="text-muted-foreground">Vidéos disponibles</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">50+</div>
              <div className="text-muted-foreground">Enseignants actifs</div>
            </div>
            <div>
              <div className="mb-2 text-3xl font-bold text-primary">500+</div>
              <div className="text-muted-foreground">Étudiants inscrits</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 md:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="mb-4 text-3xl font-bold">
            Prêt à commencer votre aventure d&apos;apprentissage ?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Rejoignez des milliers d&apos;apprenants qui transforment déjà leur
            avenir avec Cognacia.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="px-8">
              Créer un compte gratuit
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
// "use client";

// import { Button } from "@/components/common/buttons/Button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Card, CardContent } from "@/components/ui/card";
// import { BookOpen, Play, Users } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { useEffect, useState } from "react";

// // Types for video data
// interface Teacher {
//   first_name?: string;
//   last_name?: string;
//   profile_url?: string;
// }

// interface Video {
//   id: string;
//   title: string;
//   description: string;
//   thumbnail_url?: string;
//   subject: string;
//   class?: string;
//   branch?: string[];
//   teacher?: Teacher;
// }

// interface VideoData {
//   success: boolean;
//   featuredVideo?: Video;
//   explorerVideos: Video[];
// }

// function getTeacherName(teacher?: Teacher): string {
//   if (!teacher) return "Professeur";
//   return (
//     `${teacher.first_name || ""} ${teacher.last_name || ""}`.trim() ||
//     "Professeur"
//   );
// }

// // Mock function to simulate fetching videos - replace with your actual API call
// async function getHomePageVideos(): Promise<VideoData> {
//   try {
//     // Replace this with your actual API call
//     // const response = await fetch('/api/videos/home');
//     // const data = await response.json();
//     // return data;

//     // Mock data for demonstration - remove this when implementing real API
//     return {
//       success: true,
//       featuredVideo: {
//         id: "1",
//         title: "Introduction aux Mathématiques",
//         description:
//           "Découvrez les bases des mathématiques avec ce cours complet.",
//         thumbnail_url: "/images/placeholder-thumbnail.png",
//         subject: "Mathématiques",
//         class: "Terminale",
//         branch: ["Sciences"],
//         teacher: {
//           first_name: "Ahmed",
//           last_name: "Benali",
//           profile_url: "/images/placeholder-profile.png",
//         },
//       },
//       explorerVideos: [
//         {
//           id: "2",
//           title: "Physique Quantique",
//           description: "Les principes de base de la physique quantique.",
//           thumbnail_url: "/images/placeholder-thumbnail.png",
//           subject: "Physique",
//           class: "Terminale",
//           branch: ["Sciences"],
//           teacher: {
//             first_name: "Fatima",
//             last_name: "Khemir",
//           },
//         },
//         {
//           id: "3",
//           title: "Littérature Arabe",
//           description: "Exploration de la littérature arabe classique.",
//           thumbnail_url: "/images/placeholder-thumbnail.png",
//           subject: "Arabe",
//           class: "Première",
//           teacher: {
//             first_name: "Omar",
//             last_name: "Mansouri",
//           },
//         },
//       ],
//     };
//   } catch (error) {
//     console.error("Error fetching videos:", error);
//     return {
//       success: false,
//       explorerVideos: [],
//     };
//   }
// }

// export default function GuestHomePage() {
//   const [videoData, setVideoData] = useState<VideoData>({
//     success: false,
//     explorerVideos: [],
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchVideos = async () => {
//       try {
//         const data = await getHomePageVideos();
//         setVideoData(data);
//       } catch (error) {
//         console.error("Error loading videos:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchVideos();
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
//       {/* Hero Section */}
//       <section className="px-4 py-20 md:px-6 lg:px-10">
//         <div className="mx-auto max-w-4xl text-center">
//           <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
//             Bienvenue sur{" "}
//             <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
//               Cognacia
//             </span>
//           </h1>

//           <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
//             Découvrez une plateforme d&apos;apprentissage innovante où
//             enseignants et étudiants se connectent pour partager des
//             connaissances et créer un avenir meilleur.
//           </p>

//           <div className="flex flex-col sm:flex-row gap-4 justify-center">
//             <Link href="/sign-up">
//               <Button size="lg" className="w-full sm:w-auto">
//                 Commencer gratuitement
//               </Button>
//             </Link>
//             <Link href="/sign-in">
//               <Button variant="outline" size="lg" className="w-full sm:w-auto">
//                 Se connecter
//               </Button>
//             </Link>
//           </div>
//         </div>
//       </section>

//       {/* Videos Section */}
//       {loading ? (
//         <section className="px-4 py-16 md:px-6 lg:px-10">
//           <div className="mx-auto max-w-6xl">
//             <div className="text-center py-12">
//               <p className="text-muted-foreground">Chargement des vidéos...</p>
//             </div>
//           </div>
//         </section>
//       ) : videoData.success ? (
//         <section className="px-4 py-16 md:px-6 lg:px-10">
//           <div className="mx-auto max-w-6xl space-y-12">
//             {/* Featured Video */}
//             {videoData.featuredVideo && (
//               <div>
//                 <h2 className="text-3xl font-bold mb-6">Vidéo en vedette</h2>
//                 <Card>
//                   <CardContent className="p-0">
//                     <div className="grid md:grid-cols-2 gap-4 p-6">
//                       <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
//                         <Link href="/sign-in">
//                           <div className="absolute inset-0 flex items-center justify-center">
//                             <Button
//                               size="icon"
//                               variant="outline"
//                               className="hover:cursor-pointer rounded-full h-16 w-16 bg-background/80 backdrop-blur-sm"
//                             >
//                               <Play className="h-8 w-8" />
//                             </Button>
//                           </div>
//                           <Image
//                             src={
//                               videoData.featuredVideo.thumbnail_url ??
//                               "/images/placeholder-thumbnail.png"
//                             }
//                             height={300}
//                             width={500}
//                             alt="Featured video"
//                             className="object-cover w-full h-full"
//                           />
//                         </Link>
//                       </div>
//                       <div className="flex flex-col justify-between">
//                         <div>
//                           <h3 className="text-xl font-bold">
//                             {videoData.featuredVideo.title}
//                           </h3>
//                           <p className="text-muted-foreground mt-2">
//                             {videoData.featuredVideo.description}
//                           </p>
//                           <div className="flex gap-2">
//                             <div className="text-xs mt-2">
//                               <div className="flex flex-col items-center gap-2">
//                                 <div className="flex items-center gap-2">
//                                   <p>
//                                     {videoData.featuredVideo.class && (
//                                       <span className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//                                         {videoData.featuredVideo.class}
//                                       </span>
//                                     )}
//                                   </p>
//                                   <p className="px-2 py-1 w-fit bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//                                     {videoData.featuredVideo.subject}
//                                   </p>
//                                 </div>

//                                 {videoData.featuredVideo.branch &&
//                                   videoData.featuredVideo.branch?.length >
//                                     0 && (
//                                     <span className="font-medium">
//                                       {videoData.featuredVideo.branch.length >
//                                         0 && (
//                                         <p className="w-fit px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//                                           {videoData.featuredVideo.branch[0]}
//                                           {videoData.featuredVideo.branch
//                                             .length > 1 &&
//                                             `... +${
//                                               videoData.featuredVideo.branch
//                                                 .length - 1
//                                             }`}
//                                         </p>
//                                       )}
//                                     </span>
//                                   )}
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex items-center gap-2 mt-4">
//                           <Avatar className="h-8 w-8">
//                             <AvatarImage
//                               src={
//                                 videoData.featuredVideo.teacher?.profile_url ??
//                                 "/images/placeholder-profile.png"
//                               }
//                               alt={getTeacherName(
//                                 videoData.featuredVideo.teacher
//                               )}
//                             />
//                             <AvatarFallback>
//                               {getTeacherName(
//                                 videoData.featuredVideo.teacher
//                               ).charAt(0)}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div>
//                             <p className="text-sm font-medium">
//                               {getTeacherName(videoData.featuredVideo.teacher)}
//                             </p>
//                             <p className="text-xs text-muted-foreground">
//                               @
//                               {getTeacherName(videoData.featuredVideo.teacher)
//                                 .toLowerCase()
//                                 .replace(" ", "")}
//                             </p>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>
//             )}

//             {/* Explorer Videos */}
//             {videoData.explorerVideos.length > 0 && (
//               <div>
//                 <h2 className="text-3xl font-bold mb-6">Dernières vidéos</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {videoData.explorerVideos.map((video) => (
//                     <Card key={video.id} className="overflow-hidden">
//                       <CardContent className="p-0">
//                         <div className="relative aspect-video bg-muted">
//                           <Link href="/sign-in">
//                             <div className="absolute inset-0 flex items-center justify-center">
//                               <Button
//                                 size="icon"
//                                 variant="outline"
//                                 className="rounded-full h-12 w-12 bg-background/80 backdrop-blur-sm"
//                               >
//                                 <Play className="h-6 w-6" />
//                               </Button>
//                             </div>
//                             <Image
//                               src={
//                                 video.thumbnail_url ??
//                                 "/images/placeholder-thumbnail.png"
//                               }
//                               height={200}
//                               width={350}
//                               alt={video.title}
//                               className="object-cover w-full h-full"
//                             />
//                           </Link>
//                         </div>
//                         <div className="p-4">
//                           <h3 className="font-semibold text-sm mb-2 line-clamp-2">
//                             {video.title}
//                           </h3>
//                           <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
//                             {video.description}
//                           </p>

//                           <div className="flex flex-wrap gap-1 mb-3">
//                             {video.class && (
//                               <span className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//                                 {video.class}
//                               </span>
//                             )}
//                             <span className="px-2 py-1 bg-primary-100/90 text-primary-900 rounded-xl dark:bg-primary-900/30 dark:text-primary-100 text-xs">
//                               {video.subject}
//                             </span>
//                           </div>

//                           <div className="flex items-center gap-2">
//                             <Avatar className="h-6 w-6">
//                               <AvatarImage
//                                 src={
//                                   video.teacher?.profile_url ??
//                                   "/images/placeholder-profile.png"
//                                 }
//                                 alt={getTeacherName(video.teacher)}
//                               />
//                               <AvatarFallback className="text-xs">
//                                 {getTeacherName(video.teacher).charAt(0)}
//                               </AvatarFallback>
//                             </Avatar>
//                             <div className="min-w-0 flex-1">
//                               <p className="text-xs font-medium truncate">
//                                 {getTeacherName(video.teacher)}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       ) : (
//         <section className="px-4 py-16 md:px-6 lg:px-10">
//           <div className="mx-auto max-w-6xl">
//             <div className="text-center py-12">
//               <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
//               <p className="text-muted-foreground">
//                 Impossible de charger les vidéos. Veuillez réessayer plus tard.
//               </p>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Features Section */}
//       <section className="px-4 py-16 md:px-6 lg:px-10">
//         <div className="mx-auto max-w-6xl">
//           <h2 className="mb-12 text-center text-3xl font-bold">
//             Pourquoi choisir Cognacia ?
//           </h2>

//           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
//               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
//                 <Play className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Contenu Vidéo</h3>
//               <p className="text-muted-foreground">
//                 Accédez à des milliers de vidéos éducatives créées par des
//                 experts.
//               </p>
//             </div>

//             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
//               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
//                 <Users className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Communauté</h3>
//               <p className="text-muted-foreground">
//                 Rejoignez une communauté d&apos;apprenants et d&apos;enseignants
//                 passionnés.
//               </p>
//             </div>

//             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
//               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
//                 <BookOpen className="h-6 w-6 text-primary" />
//               </div>
//               <h3 className="mb-2 text-xl font-semibold">Apprentissage</h3>
//               <p className="text-muted-foreground">
//                 Apprenez à votre rythme avec des outils d&apos;apprentissage
//                 modernes.
//               </p>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Stats Section */}
//       <section className="px-4 py-16 md:px-6 lg:px-10 bg-muted/30">
//         <div className="mx-auto max-w-4xl">
//           <div className="grid gap-8 md:grid-cols-3 text-center">
//             <div>
//               <div className="mb-2 text-3xl font-bold text-primary">1000+</div>
//               <div className="text-muted-foreground">Vidéos disponibles</div>
//             </div>
//             <div>
//               <div className="mb-2 text-3xl font-bold text-primary">500+</div>
//               <div className="text-muted-foreground">Enseignants actifs</div>
//             </div>
//             <div>
//               <div className="mb-2 text-3xl font-bold text-primary">5000+</div>
//               <div className="text-muted-foreground">Étudiants inscrits</div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* CTA Section */}
//       <section className="px-4 py-20 md:px-6 lg:px-10">
//         <div className="mx-auto max-w-2xl text-center">
//           <h2 className="mb-4 text-3xl font-bold">
//             Prêt à commencer votre aventure d&apos;apprentissage ?
//           </h2>
//           <p className="mb-8 text-lg text-muted-foreground">
//             Rejoignez des milliers d&apos;apprenants qui transforment déjà leur
//             avenir avec Cognacia.
//           </p>
//           <Link href="/sign-up">
//             <Button size="lg" className="px-8">
//               Créer un compte gratuit
//             </Button>
//           </Link>
//         </div>
//       </section>
//     </div>
//   );
// }
// // "use client";

// // import { Button } from "@/components/common/buttons/Button";
// // import { BookOpen, Play, Users } from "lucide-react";
// // import Link from "next/link";

// // export default function GuestHomePage() {
// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
// //       {/* Hero Section */}
// //       <section className="px-4 py-20 md:px-6 lg:px-10">
// //         <div className="mx-auto max-w-4xl text-center">
// //           <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
// //             Bienvenue sur{" "}
// //             <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
// //               Cognacia
// //             </span>
// //           </h1>

// //           <p className="mb-8 text-lg text-muted-foreground md:text-xl max-w-2xl mx-auto">
// //             Découvrez une plateforme d&apos;apprentissage innovante où
// //             enseignants et étudiants se connectent pour partager des
// //             connaissances et créer un avenir meilleur.
// //           </p>

// //           <div className="flex flex-col sm:flex-row gap-4 justify-center">
// //             <Link href="/sign-up">
// //               <Button size="lg" className="w-full sm:w-auto">
// //                 Commencer gratuitement
// //               </Button>
// //             </Link>
// //             <Link href="/sign-in">
// //               <Button variant="outline" size="lg" className="w-full sm:w-auto">
// //                 Se connecter
// //               </Button>
// //             </Link>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Features Section */}
// //       <section className="px-4 py-16 md:px-6 lg:px-10">
// //         <div className="mx-auto max-w-6xl">
// //           <h2 className="mb-12 text-center text-3xl font-bold">
// //             Pourquoi choisir Cognacia ?
// //           </h2>

// //           <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
// //             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
// //               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
// //                 <Play className="h-6 w-6 text-primary" />
// //               </div>
// //               <h3 className="mb-2 text-xl font-semibold">Contenu Vidéo</h3>
// //               <p className="text-muted-foreground">
// //                 Accédez à des milliers de vidéos éducatives créées par des
// //                 experts.
// //               </p>
// //             </div>

// //             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
// //               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
// //                 <Users className="h-6 w-6 text-primary" />
// //               </div>
// //               <h3 className="mb-2 text-xl font-semibold">Communauté</h3>
// //               <p className="text-muted-foreground">
// //                 Rejoignez une communauté d&apos;apprenants et d&apos;enseignants
// //                 passionnés.
// //               </p>
// //             </div>

// //             <div className="text-center p-6 rounded-lg border border-border/50 bg-card">
// //               <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
// //                 <BookOpen className="h-6 w-6 text-primary" />
// //               </div>
// //               <h3 className="mb-2 text-xl font-semibold">Apprentissage</h3>
// //               <p className="text-muted-foreground">
// //                 Apprenez à votre rythme avec des outils d&apos;apprentissage
// //                 modernes.
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* Stats Section */}
// //       <section className="px-4 py-16 md:px-6 lg:px-10 bg-muted/30">
// //         <div className="mx-auto max-w-4xl">
// //           <div className="grid gap-8 md:grid-cols-3 text-center">
// //             <div>
// //               <div className="mb-2 text-3xl font-bold text-primary">1000+</div>
// //               <div className="text-muted-foreground">Vidéos disponibles</div>
// //             </div>
// //             <div>
// //               <div className="mb-2 text-3xl font-bold text-primary">500+</div>
// //               <div className="text-muted-foreground">Enseignants actifs</div>
// //             </div>
// //             <div>
// //               <div className="mb-2 text-3xl font-bold text-primary">5000+</div>
// //               <div className="text-muted-foreground">Étudiants inscrits</div>
// //             </div>
// //           </div>
// //         </div>
// //       </section>

// //       {/* CTA Section */}
// //       <section className="px-4 py-20 md:px-6 lg:px-10">
// //         <div className="mx-auto max-w-2xl text-center">
// //           <h2 className="mb-4 text-3xl font-bold">
// //             Prêt à commencer votre aventure d&apos;apprentissage ?
// //           </h2>
// //           <p className="mb-8 text-lg text-muted-foreground">
// //             Rejoignez des milliers d&apos;apprenants qui transforment déjà leur
// //             avenir avec Cognacia.
// //           </p>
// //           <Link href="/sign-up">
// //             <Button size="lg" className="px-8">
// //               Créer un compte gratuit
// //             </Button>
// //           </Link>
// //         </div>
// //       </section>
// //     </div>
// //   );
// // }
