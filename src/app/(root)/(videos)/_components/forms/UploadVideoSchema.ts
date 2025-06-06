import { z } from "zod";

const ACCEPTED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png"];

export const uploadVideoSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  subject: z.string().min(1, "La matière est requise"),
  class: z.string().min(1, "La classe est requise"),

  branch: z.array(z.string()).optional(),
  description: z
    .string()
    .max(2000, "La description ne doit pas dépasser 2000 caractères")
    .optional(),

  videoFile: z
    .any()
    .refine(
      (file) => file instanceof File || (file && file[0] instanceof File),
      {
        message: "La vidéo est requise",
      }
    )
    .refine(
      (file) =>
        file instanceof File
          ? ["video/mp4", "video/webm"].includes(file.type)
          : ["video/mp4", "video/webm"].includes(file?.[0]?.type),
      {
        message: "La vidéo doit être au format MP4 ou WEBM",
      }
    ),

  thumbnailFile: z
    .any()
    .refine(
      (file) => file instanceof File || (file && file[0] instanceof File),
      {
        message: "La miniature est requise",
      }
    )
    .refine(
      (file) =>
        file instanceof File
          ? ["image/jpeg", "image/png"].includes(file.type)
          : ["image/jpeg", "image/png"].includes(file?.[0]?.type),
      {
        message: "La miniature doit être une image JPEG ou PNG",
      }
    ),
  notesFile: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;

        const f = file instanceof File ? file : file[0];
        return f instanceof File && ACCEPTED_MIME_TYPES.includes(f.type);
      },
      { message: "Les notes doivent être au format PDF, JPG ou PNG" }
    )
    .optional(),

  documentsFile: z
    .any()
    .refine(
      (file) => {
        if (!file) return true;

        const f = file instanceof File ? file : file[0];
        return f instanceof File && ACCEPTED_MIME_TYPES.includes(f.type);
      },
      { message: "Les documents doivent être au format PDF, JPG ou PNG" }
    )
    .optional(),
});

export type UploadVideoSchemaType = z.infer<typeof uploadVideoSchema>;

export const files = z.object({
  videoFile: z
    .any()
    .refine(
      (file) => file instanceof File || (file && file[0] instanceof File),
      {
        message: "La vidéo est requise",
      }
    )
    .refine(
      (file) =>
        file instanceof File
          ? ["video/mp4", "video/webm"].includes(file.type)
          : ["video/mp4", "video/webm"].includes(file?.[0]?.type),
      {
        message: "La vidéo doit être au format MP4 ou WEBM",
      }
    ),

  thumbnailFile: z
    .any()
    .refine(
      (file) => file instanceof File || (file && file[0] instanceof File),
      {
        message: "La miniature est requise",
      }
    )
    .refine(
      (file) =>
        file instanceof File
          ? ["image/jpeg", "image/png"].includes(file.type)
          : ["image/jpeg", "image/png"].includes(file?.[0]?.type),
      {
        message: "La miniature doit être une image JPEG ou PNG",
      }
    ),
  notesFile: z
    .any()
    .refine(
      (file) =>
        !file ||
        (file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type)),
      { message: "Les notes doivent être au format PDF, JPG ou PNG" }
    )
    .optional(),

  documentsFile: z
    .any()
    .refine(
      (file) =>
        !file ||
        (file[0] instanceof File && ACCEPTED_MIME_TYPES.includes(file[0].type)),
      { message: "Les documents doivent être au format PDF, JPG ou PNG" }
    )
    .optional(),
});
