"use client";

import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "../SignUp.schema";

const StudentSchema = SignUpSchema.pick({
  branch: true,
  class: true,
  residence: true,
  password: true,
  repeatPassword: true,
});
const TeacherSchema = SignUpSchema.pick({
  specialty: true,
  diplomeFile: true,
  identityFile: true,
});

const SignUpDetailsSchema = z.discriminatedUnion("role", [
  StudentSchema.extend({ role: z.literal("student") }),
  TeacherSchema.extend({ role: z.literal("teacher") }),
]);
type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

export default function SignUpDetailsForm() {
  const router = useRouter();
  const [role, setRole] = useState("student");
  useEffect(() => {
    const signupData = localStorage.getItem("signUpData");
    const parsedSignupData = signupData ? JSON.parse(signupData) : null;
    // const role = parsedSignupData?.role;
    // const role = "teacher";
    setRole(parsedSignupData?.role);
  }, []);

  const defaultValues =
    role === "teacher"
      ? {
          specialty: "",
          diplomeFile: "",
          identityFile: "",
        }
      : {
          branch: "",
          class: "",
          residence: "",
          password: "",
          repeatPassword: "",
        };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDetailsSchemaType>({
    resolver: zodResolver(SignUpDetailsSchema),
    defaultValues,
  });

  console.log("role from the prev form ", role);
  console.log("errors", errors);
  const onSubmit = (data: SignUpDetailsSchemaType) => {
    if (data.role === "teacher") {
      const diplomeFile = (data.diplomeFile as FileList)[0];
      const identityFile = (data.identityFile as FileList)[0];
      //todo upload the files and get the urls
      const formData = new FormData();
      formData.append("diplomeFile", diplomeFile);
      formData.append("identityFile", identityFile);

      console.log("Form data to send", formData);
      console.log("files", diplomeFile, identityFile);

      router.push("/sign-up/confirmation");
    }

    if (data.role === "student") {
      console.log("Student form data", data);
      router.push("/sign-up/verify-email");
    }

    // router.push("/sign-up/confirmation");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {/* Teacher Fields */}
      {role === "teacher" && (
        <>
          <Input {...register("role")} value={role} type="hidden" />
          <div className="flex flex-col gap-1">
            <Label>Spécialité</Label>
            <Input {...register("specialty")} placeholder="Votre spécialité" />
            {"specialty" in errors && errors.specialty && (
              <p className="text-red-500">{errors?.specialty?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Carte d'identité front</Label>
            <Input
              type="file"
              {...register("identityFile")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {"identityFile" in errors && errors.identityFile && (
              <p className="text-red-500">
                {errors.identityFile?.message?.toString()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Carte d'identité back</Label>
            <Input
              type="file"
              {...register("identityFile")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {"identityFile" in errors && errors.identityFile && (
              <p className="text-red-500">
                {errors.identityFile?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Diplôme</Label>
            <Input type="file" accept=".pdf" {...register("diplomeFile")} />
            {"diplomeFile" in errors && errors.diplomeFile && (
              <p className="text-red-500">
                {errors.diplomeFile?.message?.toString()}
              </p>
            )}
          </div>
        </>
      )}

      {/* Student Fields */}
      {role === "student" && (
        <>
          <Input {...register("role")} value={role} type="hidden" />
          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            <Input {...register("branch")} placeholder="Votre filière" />
            {"branch" in errors && errors.branch && (
              <p className="text-red-500">{errors.branch.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Classe</Label>
            <Input {...register("class")} placeholder="Votre classe" />
            {"class" in errors && errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Établissement</Label>
            <Input
              {...register("residence")}
              placeholder="Nom de l'établissement"
            />
            {"residence" in errors && errors.residence && (
              <p className="text-red-500">{errors.residence.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Mot de passe</Label>
            <Input type="password" {...register("password")} />
            {"password" in errors && errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Confirmer le mot de passe</Label>
            <Input type="password" {...register("repeatPassword")} />
            {"repeatPassword" in errors && errors.repeatPassword && (
              <p className="text-red-500">{errors.repeatPassword.message}</p>
            )}
          </div>
        </>
      )}

      {/* Button Group */}
      <div className="flex gap-3 w-full ">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className=" flex-1  py-4 "
        >
          Back
        </Button>
        <Button type="submit" className=" flex-1 py-4">
          Continuer
        </Button>
      </div>
    </form>
  );
}
