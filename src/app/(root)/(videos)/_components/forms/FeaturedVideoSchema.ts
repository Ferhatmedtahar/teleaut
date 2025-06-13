import { z } from "zod";

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
const MAX_IMAGE_SIZE = 100 * 1024 * 1024; // 50MB
const MAX_DOCUMENT_SIZE = 100 * 1024 * 1024; // 50MB

const ACCEPTED_VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
  "video/x-msvideo",
];

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const ACCEPTED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
];

export const featuredVideoSchema = z.object({
  title: z
    .string()
    .min(1, "Le titre est requis")
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne peut pas dépasser 100 caractères"),

  description: z
    .string()
    .max(1000, "La description ne peut pas dépasser 1000 caractères")
    .optional(),

  is_featured: z.boolean(),

  videoFile: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "Le fichier vidéo doit être un fichier valide")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_FILE_SIZE;
    }, `La taille du fichier vidéo ne doit pas dépasser ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_VIDEO_TYPES.includes(file.type);
    }, "Seuls les formats vidéo .mp4, .webm, .ogg, .mov, .avi sont acceptés"),

  thumbnailFile: z
    .any()
    .optional()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "La thumbnail doit être un fichier valide")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_IMAGE_SIZE;
    }, `La taille de l'image ne doit pas dépasser ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "Seuls les formats d'image .jpg, .jpeg, .png, .webp sont acceptés"),

  documentsFile: z
    .any()
    .optional()
    .nullable()
    .refine((file) => {
      if (!file) return true;
      return file instanceof File;
    }, "Le document doit être un fichier valide")
    .refine((file) => {
      if (!file) return true;
      return file.size <= MAX_DOCUMENT_SIZE;
    }, `La taille du document ne doit pas dépasser ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`)
    .refine((file) => {
      if (!file) return true;
      return ACCEPTED_DOCUMENT_TYPES.includes(file.type);
    }, "Seuls les formats .pdf, .jpg, .jpeg, .png sont acceptés pour les documents"),
});

export type FeaturedVideoSchemaType = z.infer<typeof featuredVideoSchema>;
// import { z } from "zod";

// const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB
// const MAX_IMAGE_SIZE = 50 * 1024 * 1024; // 50MB
// const MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB

// const ACCEPTED_VIDEO_TYPES = [
//   "video/mp4",
//   "video/webm",
//   "video/ogg",
//   "video/quicktime",
//   "video/x-msvideo",
// ];

// const ACCEPTED_IMAGE_TYPES = [
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
//   "image/webp",
// ];

// const ACCEPTED_DOCUMENT_TYPES = [
//   "application/pdf",
//   "image/jpeg",
//   "image/jpg",
//   "image/png",
// ];

// export const featuredVideoSchema = z.object({
//   title: z
//     .string()
//     .min(1, "Le titre est requis")
//     .min(3, "Le titre doit contenir au moins 3 caractères")
//     .max(100, "Le titre ne peut pas dépasser 100 caractères"),

//   description: z
//     .string()
//     .max(1000, "La description ne peut pas dépasser 1000 caractères")
//     .optional(),

//   is_featured: z.boolean().default(false),

//   videoFile: z
//     .any()
//     .optional()
//     .refine((file) => {
//       if (!file) return true;
//       return file instanceof File;
//     }, "Le fichier vidéo doit être un fichier valide")
//     .refine((file) => {
//       if (!file) return true;
//       return file.size <= MAX_FILE_SIZE;
//     }, `La taille du fichier vidéo ne doit pas dépasser ${MAX_FILE_SIZE / (1024 * 1024)}MB`)
//     .refine((file) => {
//       if (!file) return true;
//       return ACCEPTED_VIDEO_TYPES.includes(file.type);
//     }, "Seuls les formats vidéo .mp4, .webm, .ogg, .mov, .avi sont acceptés"),

//   thumbnailFile: z
//     .any()
//     .optional()
//     .refine((file) => {
//       if (!file) return true;
//       return file instanceof File;
//     }, "La thumbnail doit être un fichier valide")
//     .refine((file) => {
//       if (!file) return true;
//       return file.size <= MAX_IMAGE_SIZE;
//     }, `La taille de l'image ne doit pas dépasser ${MAX_IMAGE_SIZE / (1024 * 1024)}MB`)
//     .refine((file) => {
//       if (!file) return true;
//       return ACCEPTED_IMAGE_TYPES.includes(file.type);
//     }, "Seuls les formats d'image .jpg, .jpeg, .png, .webp sont acceptés"),

//   documentsFile: z
//     .any()
//     .optional()
//     .nullable()
//     .refine((file) => {
//       if (!file) return true;
//       return file instanceof File;
//     }, "Le document doit être un fichier valide")
//     .refine((file) => {
//       if (!file) return true;
//       return file.size <= MAX_DOCUMENT_SIZE;
//     }, `La taille du document ne doit pas dépasser ${MAX_DOCUMENT_SIZE / (1024 * 1024)}MB`)
//     .refine((file) => {
//       if (!file) return true;
//       return ACCEPTED_DOCUMENT_TYPES.includes(file.type);
//     }, "Seuls les formats .pdf, .jpg, .jpeg, .png sont acceptés pour les documents"),
// });

// export type FeaturedVideoSchemaType = z.infer<typeof featuredVideoSchema>;
