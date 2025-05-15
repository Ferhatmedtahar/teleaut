"use client";

import type React from "react";

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
import { useUser } from "@/providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Loader2, Plus, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const uploadVideoSchema = z.object({
  title: z.string(),
  subject: z.string(),
  class: z.string(),
  description: z.string(),
  video: z.custom<File>(),
  thumbnail: z.custom<File>(),
});

export default function VideoUploadForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(uploadVideoSchema),
    defaultValues: {},
  });
  const user = useUser();

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes("video/")) {
        return;
      }
      setVideoFile(file);
    }
  };

  const handleThumbnailSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.includes("image/")) {
        return;
      }
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  async function onSubmit(formData: FormData) {
    const parsedData = await uploadVideoSchema.parseAsync(formData);

    const { title, subject, class: classValue, description } = parsedData;

    if (!videoFile) {
      toast.error("Veuillez choisir un fichier video");
      return;
    }

    if (!title) {
      toast.error("Veuillez entrer un titre");
      return;
    }

    if (!subject) {
      toast.error("Veuillez sélectionner une matière");
      return;
    }

    if (!classValue) {
      toast.error("Veuillez sélectionner une classe");
      return;
    }

    try {
      // const result = await uploadVideo({
      //   videoFile,
      //   thumbnailFile,
      //   title,
      //   subject,
      //   classValue,
      //   description,
      //   userId: user?.id,
      // });
      const result = { success: true, message: "Video uploaded successfully" };
      // Show success message or redirect
      if (result.success) {
        toast.success("Video uploaded successfully");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload video");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="gradient-bg-light rounded-lg overflow-hidden">
        <div className="p-12 flex flex-col items-center justify-center text-white">
          <Upload className="w-12 h-12 mb-4" />
          <input
            type="file"
            className="hidden"
            {...register("video")}
            accept="video/*"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => videoInputRef.current?.click()}
            className="bg-transparent border-white text-white hover:bg-white hover:text-slate-800"
          >
            {videoFile ? "Changer la vidéo" : "Publier un vidéo"}
          </Button>
          {videoFile && <p className="mt-2 text-sm">{videoFile.name}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-1">
              Veuillez entrer le titre
            </label>
            <Input
              id="title"
              {...register("title")}
              placeholder="Le titre"
              className="w-full"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Veuillez entrer la matière
            </label>
            <Select {...register("subject")}>
              <SelectTrigger className="w-full">
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
          </div>

          <div>
            <label htmlFor="class" className="block text-sm font-medium mb-1">
              Veuillez entrer la classe
            </label>
            <Select {...register("class")}>
              <SelectTrigger className="w-full">
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
          </div>

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

        <div>
          <label className="block text-sm font-medium mb-1">Thumbnail</label>
          <div
            className="border-2 border-dashed rounded-md h-40 flex flex-col items-center justify-center cursor-pointer"
            onClick={() => thumbnailInputRef.current?.click()}
          >
            <input
              type="file"
              {...register("thumbnail")}
              className="hidden"
              accept="image/*"
            />

            {thumbnailPreview ? (
              <div className="relative w-full h-full">
                <Image
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail preview"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <ImagePlus className="w-8 h-8 text-gray-400" />
              </div>
            )}
          </div>
        </div>
      </div>

      {"thumbnail" in errors && errors && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.thumbnail}
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">
          Upload Notes <span className="text-red-500">*</span>
        </label>
        <input
          type="file"
          id="notes"
          name="notes"
          accept=".pdf,.png,.jpg,.jpeg"
          className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Other Documents File Upload */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="documents"
          className="text-sm font-medium text-gray-700"
        >
          Upload Other Documents
        </label>
        <input
          type="file"
          id="documents"
          name="documents"
          accept=".pdf,.png,.jpg,.jpeg"
          className="block w-full file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {isSubmitting && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
          </div>
        </div>
      )}

      <Button
        type="submit"
        variant="default"
        size="lg"
        className="w-full md:w-1/2"
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
            <span>Publier</span>
          </>
        )}
      </Button>
    </form>
  );
}
