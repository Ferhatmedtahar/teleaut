"use client";

import { uploadVideo } from "@/actions/videos/uploadVideo.action";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ImagePlus, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema with proper file validation
const uploadVideoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subject: z.string().min(1, "La matière est requise"),
  class: z.string().min(1, "La classe est requise"),
  description: z.string().optional(),
  // We'll handle file validation separately since zod doesn't handle File objects well
});

type FormValues = z.infer<typeof uploadVideoSchema> & {
  videoFile?: File;
  thumbnailFile?: File;
  notesFile?: File;
  documentsFile?: File;
};

export default function VideoUploadForm() {
  // State for file uploads
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [notesFile, setNotesFile] = useState<File | null>(null);
  const [documentsFile, setDocumentsFile] = useState<File | null>(null);

  // State for previews
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // State for upload progress
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Refs for file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLInputElement>(null);
  const documentsInputRef = useRef<HTMLInputElement>(null);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      subject: "",
      class: "",
      description: "",
    },
  });

  // Mock user for now - replace with your actual user context
  const user = { id: "user123" };

  // Handle file selection for video
  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes("video/")) {
        toast.error("Le fichier sélectionné n'est pas une vidéo");
        return;
      }
      setVideoFile(file);
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
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  // Handle file selection for notes
  const handleNotesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNotesFile(file);
    }
  };

  // Handle file selection for documents
  const handleDocumentsSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDocumentsFile(file);
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

  // Handle form submission
  const onSubmit = async (data: FormValues) => {
    if (!videoFile) {
      toast.error("Veuillez choisir un fichier vidéo");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 500);

      // Upload video and related files
      const result = await uploadVideo({
        videoFile,
        thumbnailFile: thumbnailFile || null,
        notesFile: notesFile || null,
        documentsFile: documentsFile || null,
        title: data.title,
        subject: data.subject,
        classValue: data.class,
        description: data.description || "",
        userId: user.id,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Show success message
      toast.success("Vidéo téléchargée avec succès!");

      // Reset form
      reset();
      setVideoFile(null);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      setNotesFile(null);
      setDocumentsFile(null);
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors du téléchargement"
      );
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Clear a selected file
  const clearFile = (type: "video" | "thumbnail" | "notes" | "documents") => {
    switch (type) {
      case "video":
        setVideoFile(null);
        if (videoInputRef.current) videoInputRef.current.value = "";
        break;
      case "thumbnail":
        setThumbnailFile(null);
        setThumbnailPreview(null);
        if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
        break;
      case "notes":
        setNotesFile(null);
        if (notesInputRef.current) notesInputRef.current.value = "";
        break;
      case "documents":
        setDocumentsFile(null);
        if (documentsInputRef.current) documentsInputRef.current.value = "";
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Video Upload Area */}
      <div className="gradient-bg-light  rounded-lg overflow-hidden shadow-lg">
        <div className="p-12 flex flex-col items-center justify-center text-white">
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
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-700"
              >
                Changer la vidéo
              </Button>
            </div>
          ) : (
            <>
              <Upload className="w-16 h-16 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Publier un vidéo</h3>
              <p className="text-sm text-center mb-4 max-w-md opacity-90">
                Glissez et déposez votre fichier vidéo ici, ou cliquez pour
                sélectionner
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => videoInputRef.current?.click()}
                className="bg-transparent border-white text-white hover:bg-white hover:text-indigo-700"
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
        </div>
      </div>

      <h2 className="text-2xl font-bold my-4">Informations de la vidéo</h2>
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

          {/* Subject Dropdown */}
          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Veuillez entrer la matière <span className="text-red-500">*</span>
            </label>
            <Controller
              name="subject"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={`w-full ${
                      errors.subject ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="La matière" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="math">Mathématiques</SelectItem>
                    <SelectItem value="physics">Physique</SelectItem>
                    <SelectItem value="chemistry">Chimie</SelectItem>
                    <SelectItem value="biology">Biologie</SelectItem>
                    <SelectItem value="history">Histoire</SelectItem>
                    <SelectItem value="geography">Géographie</SelectItem>
                    <SelectItem value="french">Français</SelectItem>
                    <SelectItem value="english">Anglais</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-500">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* Class Dropdown */}
          <div>
            <label htmlFor="class" className="block text-sm font-medium mb-1">
              Veuillez entrer la classe <span className="text-red-500">*</span>
            </label>
            <Controller
              name="class"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger
                    className={`w-full ${errors.class ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="La classe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="6">6ème</SelectItem>
                    <SelectItem value="5">5ème</SelectItem>
                    <SelectItem value="4">4ème</SelectItem>
                    <SelectItem value="3">3ème</SelectItem>
                    <SelectItem value="2">2nde</SelectItem>
                    <SelectItem value="1">1ère</SelectItem>
                    <SelectItem value="terminal">Terminale</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.class && (
              <p className="mt-1 text-sm text-red-500">
                {errors.class.message}
              </p>
            )}
          </div>

          {/* Description Textarea */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-1"
            >
              Veuillez insérer une description (optionnel)
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description"
              className="w-full min-h-[120px]"
            />
          </div>
        </div>

        {/* Thumbnail Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <div
            className={`border-2 border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
              thumbnailPreview
                ? "border-indigo-300 bg-indigo-50"
                : "hover:bg-gray-50"
            }`}
            onClick={() => thumbnailInputRef.current?.click()}
          >
            <input
              type="file"
              ref={thumbnailInputRef}
              onChange={handleThumbnailSelect}
              className="hidden"
              accept="image/*"
            />

            {thumbnailPreview ? (
              <div className="relative w-full h-full group">
                <Image
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-md"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    className="z-10"
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
              <div className="flex flex-col items-center justify-center h-full p-4">
                <ImagePlus className="w-10 h-10 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center">
                  Cliquez pour ajouter une miniature
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notes File Upload */}
      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Upload Notes <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="notes"
            ref={notesInputRef}
            onChange={handleNotesSelect}
            accept=".pdf,.png,.jpg,.jpeg"
            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {notesFile && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => clearFile("notes")}
              className="flex-shrink-0"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>
        {notesFile && (
          <p className="text-sm text-gray-500">
            {notesFile.name} ({(notesFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Other Documents File Upload */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="documents"
          className="text-sm font-medium text-gray-700"
        >
          Upload Other Documents
        </label>
        <div className="flex items-center gap-2">
          <input
            type="file"
            id="documents"
            ref={documentsInputRef}
            onChange={handleDocumentsSelect}
            accept=".pdf,.png,.jpg,.jpeg"
            className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <p className="text-sm text-gray-500">
            {documentsFile.name} ({(documentsFile.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Téléchargement en cours...</span>
            </div>
            <span className="text-sm font-medium">{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-auto "
        disabled={isSubmitting || isUploading}
      >
        {isSubmitting || isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Téléchargement...
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 mr-2" />
            <span>Publier</span>
          </>
        )}
      </Button>
    </form>
  );
}
