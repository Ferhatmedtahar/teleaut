import { Button } from "@/components/common/buttons/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { RelatedVideo } from "@/types/RelatedVideos.interface";
import { Crown, Eye, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function getTeacherName(teacher: any): string {
  if (!teacher) return "Professeur";
  return (
    `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() ||
    "Professeur"
  );
}

export default function FeaturedVideo({
  featuredVideo,
}: {
  readonly featuredVideo: RelatedVideo;
}) {
  return (
    <div className="w-full">
      {/* Featured Badge */}
      {/* <div className="flex items-center justify-center mb-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-600 dark:to-primary-800 text-white rounded-full shadow-lg">
          <Crown className="h-4 w-4" />
          <span className="text-sm font-semibold">Professeur Vedette</span>
          <Star className="h-4 w-4 fill-current" />
        </div>
      </div> */}

      <Card className="w-full overflow-hidden hover:shadow-border/10 hover:shadow-xl border border-border/30 dark:border-border/90 transition-all duration-500  bg-gradient-to-br from-background via-background to-primary/5">
        <CardContent className="p-0">
          <div className="grid lg:grid-cols-5 gap-0">
            <div className="lg:col-span-2 relative aspect-video ">
              <Link href={`/videos/${featuredVideo.id}`}>
                <div className="absolute top-3 left-3 z-20">
                  <div className="inline-flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full text-xs font-semibold shadow-lg">
                    <Star className="h-3 w-3 fill-current" />
                    Premium
                  </div>
                </div>

                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full h-16 w-16 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-2 border-primary/20 hover:bg-primary hover:text-white hover:border-primary hover:scale-105 transition-all duration-300 shadow-2xl"
                  >
                    <Play className="h-7 w-7 ml-1" />
                  </Button>
                </div>

                <Image
                  src={
                    featuredVideo.thumbnail_url ??
                    "/images/placeholder-thumbnail.png"
                  }
                  height={400}
                  width={600}
                  alt="Featured video"
                  className="object-cover w-full h-full rounded-r-xl hover:scale-105 transition-transform duration-500 rounded-l-xl lg:rounded-l-none"
                />
              </Link>
            </div>

            {/* Content Section - Enhanced */}
            <div className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-between min-h-[300px] bg-gradient-to-br from-background to-primary/5">
              {/* Header Section */}
              <div className="space-y-4">
                {/* Title with enhanced styling */}
                <div>
                  <h3 className="text-xl lg:text-2xl font-bold leading-tight line-clamp-2 mb-3 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {featuredVideo.title}
                  </h3>
                  <p className="text-primary-950 dark:text-primary-50 text-sm lg:text-base line-clamp-3 leading-relaxed">
                    {featuredVideo.description}
                  </p>
                </div>

                {/* Enhanced Tags Section */}
                <div className="space-y-3">
                  {/* Class and Subject - Primary tags */}
                  <div className="flex flex-wrap gap-2">
                    {/* {featuredVideo.class && (
                      <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-primary to-primary/80 text-white rounded-full text-sm font-semibold shadow-md">
                        📚 {featuredVideo.class}
                      </span>
                    )} */}
                    <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full text-sm font-semibold shadow-md">
                      📖 {featuredVideo.subject}
                    </span>
                  </div>

                  {/* Branches - Secondary tags */}
                  {featuredVideo.branch && featuredVideo.branch.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {featuredVideo.branch
                        .slice(0, 3)
                        .map((branchItem, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-1 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-200 rounded-full text-xs font-medium border border-purple-200 dark:border-purple-700"
                          >
                            {branchItem}
                          </span>
                        ))}
                      {featuredVideo.branch.length > 3 && (
                        <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                          +{featuredVideo.branch.length - 3} autres
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Footer Section */}
              <div className="space-y-4 pt-6 border-t-2 border-gradient-to-r from-primary/20 to-transparent">
                {/* Teacher Info - Enhanced */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-14 w-14 ring-4 ring-primary/20 shadow-xl">
                        <AvatarImage
                          src={
                            featuredVideo.teacher?.profile_url ??
                            "/images/placeholder-profile.png"
                          }
                          alt={getTeacherName(featuredVideo.teacher)}
                        />
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary/70 text-white font-bold text-lg">
                          {getTeacherName(featuredVideo.teacher)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div>
                      <p className="text-base font-bold text-foreground flex items-center gap-2">
                        {getTeacherName(featuredVideo.teacher)}
                        <Star className="h-4 w-4 text-amber-500 fill-current" />
                      </p>
                      <p className="text-sm  text-primary-900 dark:text-primary-100  ">
                        @
                        {getTeacherName(featuredVideo.teacher)
                          .toLowerCase()
                          .replace(/\s+/g, "")}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 text-primary-900 dark:text-primary-100  mb-1">
                      <Eye className="h-5 w-5" />
                      <span className="text-lg font-bold">
                        {featuredVideo?.views > 0
                          ? featuredVideo.views.toLocaleString()
                          : "0"}
                      </span>
                    </div>
                    <p className="text-xs  text-primary-900 dark:text-primary-100 ">
                      vues
                    </p>
                  </div>
                </div>

                {/* Call to Action */}
                <div className="flex gap-3 pt-2">
                  <Button
                    asChild
                    className="flex-1  font-semibold  shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Link href={`/videos/${featuredVideo.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Regarder maintenant
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { RelatedVideo } from "@/types/RelatedVideos.interface";
// import { Eye, Play } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";

// function getTeacherName(teacher: any): string {
//   if (!teacher) return "Professeur";
//   return (
//     `${teacher.first_name ?? ""} ${teacher.last_name ?? ""}`.trim() ||
//     "Professeur"
//   );
// }

// export default function FeaturedVideo({
//   featuredVideo,
// }: {
//   readonly featuredVideo: RelatedVideo;
// }) {
//   return (
//     <Card className="overflow-hidden hover:shadow-lg hover:shadow-border/10 border border-border/30 dark:border-border/90 transition-shadow duration-300">
//       <CardContent className="p-0">
//         <div className="grid md:grid-cols-5 gap-0">
//           <div className="md:col-span-2 relative aspect-video bg-gray-100 dark:bg-gray-800">
//             <Link href={`/videos/${featuredVideo.id}`}>
//               <div className="absolute inset-0 flex items-center justify-center z-10">
//                 <Button
//                   size="icon"
//                   variant="outline"
//                   className="hover:cursor-pointer rounded-full h-14 w-14 bg-background/90 backdrop-blur-sm border-1 hover:bg-border hover:text-primary-foreground transition-all duration-200"
//                 >
//                   <Play className="h-6 w-6 ml-0.5" />
//                 </Button>
//               </div>
//               <Image
//                 src={
//                   featuredVideo.thumbnail_url ??
//                   "/images/placeholder-thumbnail.png"
//                 }
//                 height={400}
//                 width={600}
//                 alt="Featured video"
//                 className="object-cover w-full h-full hover:scale-105 rounded-r-xl transition-transform duration-300"
//               />
//             </Link>
//           </div>

//           {/* Content Section - Takes 3/5 of the width */}
//           <div className="md:col-span-3 p-4 md:p-6 flex flex-col justify-between min-h-[240px]">
//             {/* Header Section */}
//             <div className="space-y-3">
//               <div>
//                 <h3 className="text-lg md:text-xl font-bold leading-tight line-clamp-2 mb-2">
//                   {featuredVideo.title}
//                 </h3>
//                 <p className="text-primary-900 dark:text-primary-50 text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
//                   {featuredVideo.description}
//                 </p>
//               </div>

//               {/* Tags Section - More compact layout */}
//               <div className="space-y-2">
//                 {/* Class and Subject */}
//                 <div className="flex flex-wrap gap-1.5 md:gap-2">
//                   {featuredVideo.class && (
//                     <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
//                       {featuredVideo.class}
//                     </span>
//                   )}
//                   <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
//                     {featuredVideo.subject}
//                   </span>
//                 </div>

//                 {/* Branches on new line */}
//                 {featuredVideo.branch && featuredVideo.branch.length > 0 && (
//                   <div className="flex flex-wrap gap-1 md:gap-1.5">
//                     {featuredVideo.branch
//                       .slice(0, 2)
//                       .map((branchItem, index) => (
//                         <span
//                           key={index}
//                           className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium"
//                         >
//                           {branchItem}
//                         </span>
//                       ))}
//                     {featuredVideo.branch.length > 2 && (
//                       <span className="inline-flex items-center px-2 md:px-2.5 py-1 bg-primary-100/80 text-primary-950 dark:bg-primary-900/30 dark:text-primary-100 rounded-full text-xs font-medium">
//                         +{featuredVideo.branch.length - 2}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Footer Section */}
//             <div className="flex items-center justify-between pt-4 border-t border-border/50">
//               {/* Teacher Info */}
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-10 w-10 ring-2 ring-background shadow-sm">
//                   <AvatarImage
//                     src={
//                       featuredVideo.teacher?.profile_url ??
//                       "/images/placeholder-profile.png"
//                     }
//                     alt={getTeacherName(featuredVideo.teacher)}
//                   />
//                   <AvatarFallback className="bg-primary/10 text-primary font-semibold">
//                     {getTeacherName(featuredVideo.teacher)
//                       .split(" ")
//                       .map((n) => n[0])
//                       .join("")
//                       .substring(0, 2)
//                       .toUpperCase()}
//                   </AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-sm font-semibold text-foreground">
//                     {getTeacherName(featuredVideo.teacher)}
//                   </p>
//                   <p className="text-xs text-primary-900 dark:text-primary-50">
//                     @
//                     {getTeacherName(featuredVideo.teacher)
//                       .toLowerCase()
//                       .replace(/\s+/g, "")}
//                   </p>
//                 </div>
//               </div>

//               {featuredVideo?.views > 0 ? (
//                 <div className="flex items-center gap-1.5 text-primary-900 dark:text-primary-50">
//                   <Eye className="h-4 w-4" />
//                   <span className="text-sm font-medium">
//                     {featuredVideo.views.toLocaleString()} vues
//                   </span>
//                 </div>
//               ) : (
//                 <div className="flex items-center gap-1.5 text-primary-900 dark:text-primary-50">
//                   <Eye className="h-4 w-4" />
//                   <span className="text-sm font-medium">0 vues</span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// }
