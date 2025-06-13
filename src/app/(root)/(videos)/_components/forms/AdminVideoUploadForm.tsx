"use client";
import { Button } from "@/components/common/buttons/Button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ImagePlus, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createFeaturedVideoRecord } from "@/actions/videos/uploadFeaturedVideo.action";
import { uploadVideoSecureClient } from "@/lib/helpers/uploadVideo";
import { useRouter } from "next/navigation";
import {
  featuredVideoSchema,
  FeaturedVideoSchemaType,
} from "./FeaturedVideoSchema";

export default function FeaturedVideoUploadForm({
  userId,
}: {
  readonly userId: string;
}) {
  const router = useRouter();

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const documentsInputRef = useRef<HTMLInputElement>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<FeaturedVideoSchemaType>({
    resolver: zodResolver(featuredVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      is_featured: false,
    },
  });

  const videoFile = watch("videoFile");
  const thumbnailFile = watch("thumbnailFile");
  const documentsFile = watch("documentsFile");
  const isFeatured = watch("is_featured");

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes("video/")) {
        toast.error("Le fichier sélectionné n'est pas une vidéo");
        return;
      }
      setValue("videoFile", file);
    }
  };

  // Handle file selection for thumbnail
  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        toast.error("Le fichier sélectionné n'est pas une image");
        return;
      }
      setValue("thumbnailFile", file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle file selection for documents
  const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("documentsFile", file);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  async function onSubmit(data: FeaturedVideoSchemaType) {
    if (!data.videoFile) {
      toast.error("Veuillez choisir un fichier vidéo");
      return;
    }

    if (!data.title) {
      toast.error("Veuillez choisir un titre");
      return;
    }

    if (!data.thumbnailFile) {
      toast.error("Veuillez choisir une thumbnail");
      return;
    }

    let uploadToastId: string | number | undefined = undefined;
    let processingToastId: string | number | undefined = undefined;

    try {
      uploadToastId = toast.loading("Téléchargement en cours...");

      const videoUrl = await uploadVideoSecureClient(data.videoFile, userId);

      toast.dismiss(uploadToastId);
      toast.success("Vidéo téléchargée avec succès!");

      // Now upload other files and create video record
      const uploadToastId2 = toast.loading("Traitement des fichiers...");

      const result = await createFeaturedVideoRecord({
        videoUrl,
        thumbnailFile: data.thumbnailFile,
        documentsFile: data.documentsFile ?? null,
        title: data.title,
        description: data.description ?? "",
        admin_id: userId,
        is_featured: data.is_featured,
      });

      toast.dismiss(uploadToastId2);

      if (result.success) {
        toast.success("Vidéo mise en avant créée avec succès!");

        const videoId = result.id;

        processingToastId = toast.loading(
          "Vidéo téléchargée, traitement en cours...",
          {
            id: `processing-toast`,
            duration: Infinity,
          }
        );

        // Video processing status polling
        const checkStatus = async () => {
          const BASE_URL =
            process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
          try {
            const statusResponse = await fetch(
              `${BASE_URL}/api/video/video-status/${videoId}`
            );

            if (!statusResponse.ok) {
              console.error(
                "Failed to fetch video status:",
                await statusResponse.text()
              );
              toast.error("Échec du suivi de l'état du traitement vidéo.", {
                id: processingToastId,
              });
              clearInterval(interval);
              toast.dismiss(processingToastId);
              return;
            }

            const data = await statusResponse.json();
            const status = data.status;

            let statusMessage = "Traitement vidéo...";
            let shouldPoll = true;

            switch (status) {
              case 0:
                statusMessage = "Vidéo en attente de traitement...";
                break;
              case 1:
                statusMessage = "Début du traitement vidéo...";
                break;
              case 2:
                statusMessage = "Encodage vidéo...";
                break;
              case 4:
                statusMessage = "Traitement des résolutions...";
                break;
              case 3:
                statusMessage = "Vidéo prête !";
                shouldPoll = false;
                break;
              case 5:
                statusMessage = "Échec du traitement vidéo.";
                shouldPoll = false;
                break;
              default:
                statusMessage = `Vous êtes presque arrivés!`;
                break;
            }

            toast.loading(statusMessage, {
              id: processingToastId,
              duration: shouldPoll ? Infinity : 3000,
            });

            if (!shouldPoll) {
              clearInterval(interval);

              if (status === 3) {
                toast.success("Vidéo prête !", { id: processingToastId });
                router.push(`/videos/${videoId}`);
              } else if (status === 5) {
                toast.error("Échec du traitement vidéo.", {
                  id: processingToastId,
                });
              }

              toast.dismiss(processingToastId);
            }
          } catch (error) {
            console.error("Erreur pendant le polling :", error);
            toast.error("Erreur réseau pendant le suivi de la vidéo.", {
              id: processingToastId,
            });
            clearInterval(interval);
            toast.dismiss(processingToastId);
          }
        };

        const interval = setInterval(checkStatus, 3000);
        checkStatus();

        reset();
        setThumbnailPreview(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";

        if (documentsInputRef.current) documentsInputRef.current.value = "";
      }
    } catch (err) {
      toast.dismiss(uploadToastId);
      toast.dismiss(processingToastId);

      console.error("Upload error:", err);

      toast.error(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors du téléchargement"
      );
    }
  }

  const clearFile = (type: "video" | "thumbnail" | "documents") => {
    switch (type) {
      case "video":
        setValue("videoFile", undefined);
        if (videoInputRef.current) videoInputRef.current.value = "";
        break;
      case "thumbnail":
        setValue("thumbnailFile", undefined);
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        break;
      case "documents":
        setValue("documentsFile", undefined);
        if (documentsInputRef.current) documentsInputRef.current.value = "";
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
      {/* Video Upload Area */}
      <div className="gradient-bg-light rounded-lg overflow-hidden shadow-lg">
        <div className="p-6 flex flex-col items-center justify-center text-white">
          {videoFile ? (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="flex items-center justify-between w-full max-w-md">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8" />
                  <div className="flex flex-col">
                    <span className="font-medium truncate max-w-[200px]">
                      {videoFile.name}
                    </span>
                    <span className="text-xs opacity-75">
                      {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFile("video")}
                  className="text-white hover:bg-primary/20 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700 dark:text-white dark:hover:text-white/85"
              >
                Changer la vidéo
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Publier une vidéo mise en avant
              </h3>
              <p className="text-sm text-center mb-4 max-w-md opacity-90">
                Glissez et déposez votre fichier vidéo ici, ou cliquez pour
                sélectionner
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="bg-transparent border-white text-white hover:bg-white dark:text-white dark:hover:text-white/85 hover:text-primary-700"
              >
                Sélectionner un fichier
              </Button>
            </>
          )}
          <input
            type="file"
            ref={videoInputRef}
            onChange={handleVideoSelect}
            className="hidden"
            accept="video/*"
          />
          {errors.videoFile && (
            <p className="mt-1 text-sm text-red-500">
              {errors.videoFile.message as string}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold my-4">
        Informations de la vidéo mise en avant
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Title Input */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Veuillez entrer le titre <span className="text-red-500">*</span>
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Le titre"
              className={`w-full ${errors.title ? "border-red-500" : ""}`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Featured Status Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_featured"
              {...register("is_featured")}
              checked={isFeatured}
              onCheckedChange={(checked) => setValue("is_featured", !!checked)}
            />
            <Label htmlFor="is_featured" className="text-sm font-medium">
              Marquer comme vidéo mise en avant
              <span className="text-gray-500 text-xs ml-1">
                (Cette vidéo apparaîtra en priorité)
              </span>
            </Label>
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Veuillez insérer une description
              <span className="text-gray-500 text-xs"> (optionnel)</span>
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description"
              className="w-full min-h-[120px] dark:placeholder:text-white/80"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Other Documents File Upload */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="documents"
              className="text-sm font-medium dark:text-white/90"
            >
              soumettre d&apos;autres documents
              <span className="text-gray-500 dark:text-gray-400 text-xs">
                {" "}
                (optionnel)
              </span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="documents"
                ref={documentsInputRef}
                onChange={handleDocumentsSelect}
                accept=".pdf,.png,.jpg,.jpeg"
                className="dark:text-white dark:placeholder:text-white/80 placeholder:text-muted-foreground selection:bg-primary selection:text-[#355869] dark:bg-primary/30 border-primary-400 block w-full file:mr-4 file:py-2 file:px-4 file:rounded-r-md file:border-0 file:text-sm file:font-medium file:bg-primary/30 dark:file:bg-primary/50 dark:file:text-white/90 file:text-primary-950 hover:file:bg-primary-100 hover:cursor-pointer border rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              {documentsFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => clearFile("documents")}
                  className="flex-shrink-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              )}
            </div>
            {documentsFile && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                {documentsFile.name} ({(documentsFile.size / 1024).toFixed(2)}{" "}
                KB)
              </p>
            )}
            {errors.documentsFile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.documentsFile.message as string}
              </p>
            )}
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label htmlFor="thumbnail" className="block text-sm font-medium mb-1">
            Thumbnail <span className="text-red-500">*</span>
          </label>
          {errors.thumbnailFile && (
            <p className="mt-1 text-sm mb-1 text-red-500">
              {errors.thumbnailFile.message as string}
            </p>
          )}
          <div
            className={`border-2 group border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
              thumbnailPreview
                ? "border-primary-400 bg-indigo-50"
                : "hover:bg-border/80 border-primary-400"
            }`}
            onClick={() => thumbnailInputRef.current?.click()}
          >
            <input
              type="file"
              id="thumbnail"
              ref={thumbnailInputRef}
              onChange={handleThumbnailSelect}
              className="hidden"
              accept="image/*"
            />

            {thumbnailPreview ? (
              <div className="relative w-full h-full group">
                <Image
                  src={thumbnailPreview || "/images/placeholder-thumbnail.jpg"}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-md"
                />
                <div className="absolute inset-0 gradient-bg-light bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-300 transition-all">
                  <Button
                    type="button"
                    variant={`secondary`}
                    size="sm"
                    className="z-10 font-medium text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      clearFile("thumbnail");
                    }}
                  >
                    Changer
                  </Button>
                </div>
              </div>
            ) : (
              <div className="  flex flex-col items-center justify-center text-gray-500 dark:text-gray-300 h-full p-4">
                <ImagePlus className="w-10 h-10 text-gray-400 mb-2 group-hover:text-gray-700 dark:group-hover:text-gray-100" />
                <p className="text-sm group-hover:text-gray-700 dark:group-hover:text-gray-100 text-gray-500 dark:text-gray-400 text-center">
                  Cliquez pour ajouter une miniature
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-auto lg:w-1/4 xl:h-10 flex items-center justify-center gap-2"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Téléchargement...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            <span>Publier vidéo mise en avant</span>
          </>
        )}
      </Button>
    </form>
  );
}
