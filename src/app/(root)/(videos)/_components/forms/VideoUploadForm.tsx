"use client";

import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { studentClasses } from "@/lib/constants/studentClassesAndBranches";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileText, ImagePlus, Loader2, Plus, Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { uploadVideoSchema, UploadVideoSchemaType } from "./UploadVideoSchema";

export default function VideoUploadForm({
  userSpecialties,
  userId,
}: {
  readonly userSpecialties: string[];
  readonly userId: string;
}) {
  const subjectOptions = userSpecialties.map((spec) => {
    // Extract the subject from the string
    const match = spec.match(/Professeur d'(.*)/i);
    return match?.[1] ?? spec;
  });

  // Refs for file inputs
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const notesInputRef = useRef<HTMLInputElement>(null);
  const documentsInputRef = useRef<HTMLInputElement>(null);

  // State for previews
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Setup react-hook-form
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
    setValue,
    watch,
  } = useForm<UploadVideoSchemaType>({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {
      title: "",
      subject: "",
      class: "",
      description: "",
    },
  });

  console.log("errors", errors);
  // Watch form fields to access their values
  const videoFile = watch("videoFile");
  const thumbnailFile = watch("thumbnailFile");
  const notesFile = watch("notesFile");
  const documentsFile = watch("documentsFile");

  // Handle file selection for video
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

  // Handle file selection for notes
  const handleNotesSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setValue("notesFile", file);
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

  // Handle form submission
  const onSubmit = async (data: UploadVideoSchemaType) => {
    console.log("data", data);
    if (!data.videoFile) {
      toast.error("Veuillez choisir un fichier vidéo");
      return;
    }
    if (!data.class) {
      toast.error("Veuillez choisir une classe");
      return;
    }
    if (!data.subject) {
      toast.error("Veuillez choisir un matière");
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

    try {
      // Upload video and related files
      // const result = await uploadVideo({
      //   videoFile: data.videoFile,
      //   thumbnailFile: data.thumbnailFile || null,
      //   notesFile: data.notesFile || null,
      //   documentsFile: data.documentsFile || null,
      //   title: data.title,
      //   subject: data.subject,
      //   classValue: data.class,
      //   description: data.description ?? "",
      //   userId,
      // });
      const result = {
        success: true,
        message: "video uploaded",
      };

      // Show success message
      toast.success("Vidéo téléchargée avec succès!");

      // Reset form
      reset();

      setThumbnailPreview(null);

      // Reset file inputs
      if (videoInputRef.current) videoInputRef.current.value = "";
      if (thumbnailInputRef.current) thumbnailInputRef.current.value = "";
      if (notesInputRef.current) notesInputRef.current.value = "";
      if (documentsInputRef.current) documentsInputRef.current.value = "";
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(
        err instanceof Error
          ? err.message
          : "Une erreur s'est produite lors du téléchargement"
      );
    }
  };

  const clearFile = (type: "video" | "thumbnail" | "notes" | "documents") => {
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
      case "notes":
        setValue("notesFile", undefined);
        if (notesInputRef.current) notesInputRef.current.value = "";
        break;
      case "documents":
        setValue("documentsFile", undefined);
        if (documentsInputRef.current) documentsInputRef.current.value = "";
        break;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700"
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
                className="bg-transparent border-white text-white hover:bg-white hover:text-primary-700"
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
                    {subjectOptions.map((subject) => (
                      <SelectItem key={subject} value={subject.toLowerCase()}>
                        {subject}
                      </SelectItem>
                    ))}
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
                    {studentClasses.map((classOption) => (
                      <SelectItem
                        key={classOption}
                        value={classOption.toLowerCase()}
                      >
                        {classOption}
                      </SelectItem>
                    ))}
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
              Veuillez insérer une description
              <span className="text-gray-500 text-xs"> (optionnel)</span>
            </label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Description"
              className="w-full min-h-[120px]"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Notes File Upload */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-gray-700"
            >
              Upload Notes
              <span className="text-gray-500 text-xs"> (optionnel)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="notes"
                ref={notesInputRef}
                onChange={handleNotesSelect}
                accept=".pdf,.png,.jpg,.jpeg"
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary-800 hover:file:bg-primary-50 border border-gray-300 rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            {errors.notesFile && (
              <p className="mt-1 text-sm text-red-500">
                {errors.notesFile.message as string}
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
              <span className="text-gray-500 text-xs"> (optionnel)</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="file"
                id="documents"
                ref={documentsInputRef}
                onChange={handleDocumentsSelect}
                accept=".pdf,.png,.jpg,.jpeg"
                className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-primary-800 hover:file:bg-primary-50 border border-gray-300 rounded-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className={`border-2 border-dashed rounded-md h-48 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden ${
              thumbnailPreview
                ? "border-primary-400 bg-indigo-50"
                : "hover:bg-gray-50 border-primary-400"
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
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-md"
                />
                <div className="absolute inset-0 gradient-bg-light bg-opacity-0 group-hover:bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 duration-200 transition-all">
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

      {/* Submit Button */}
      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-auto"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
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
