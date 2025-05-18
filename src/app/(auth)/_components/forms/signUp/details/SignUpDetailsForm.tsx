"use client";
import { useSignUpStore } from "@/app/(auth)/sign-up/store";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUpStudent } from "@/actions/auth/sign-up/signUpStudent.action";
import { signUpTeacher } from "@/actions/auth/sign-up/signUpTeacher.action";
// import BranchSelector from "@/components/common/select/BranchSelector";
import ClassSelector from "@/components/common/select/ClassSelector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import { toast } from "sonner";
import { SignUpSchema } from "../SignUp.schema";
import SpecialtiesPicker from "../SpecialtiesPicker";

const StudentSchema = SignUpSchema.pick({
  branch: true,
  class: true,
  password: true,
  confirmPassword: true,
});
const TeacherSchema = SignUpSchema.pick({
  specialties: true,
  diplomeFile: true,
  identityFileFront: true,
  identityFileBack: true,
  password: true,
  confirmPassword: true,
});

const SignUpDetailsSchema = z.discriminatedUnion("role", [
  StudentSchema.extend({ role: z.literal("student") }),
  TeacherSchema.extend({ role: z.literal("teacher") }),
]);
type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

const allClasses = Object.keys(studentClassesAndBranches);
const allBranches = Object.values(studentClassesAndBranches);
export default function SignUpDetailsForm() {
  //! check if user has filled the informations form if not redirect him back.
  const router = useRouter();

  const firstName = useSignUpStore((state) => state.firstName);
  const lastName = useSignUpStore((state) => state.lastName);
  const email = useSignUpStore((state) => state.email);
  const phoneNumber = useSignUpStore((state) => state.phoneNumber);
  const role = useSignUpStore((state) => state.role);

  // const hasHydrated = useSignUpStore.persist?.hasHydrated;
  useEffect(() => {
    if (!useSignUpStore.persist?.hasHydrated) return;

    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      router.replace("/sign-up/info");
    }
    const signedUp = localStorage.getItem("signedUp");

    const roleLocalStorage = localStorage.getItem("role");

    if (signedUp && signedUp == "true" && roleLocalStorage === "teacher") {
      router.replace("/sign-up/waitlist");
    }
    if (signedUp && signedUp == "true" && roleLocalStorage === "student") {
      router.replace("/sign-up/verify-email");
    }
  }, [
    // firstName,
    // lastName,
    router,
    // email,
    // phoneNumber,
    // role,
    useSignUpStore.persist?.hasHydrated,
  ]);

  //!get the prevous information form data
  const InfoFormData = {
    firstName: useSignUpStore((state) => state.firstName),
    lastName: useSignUpStore((state) => state.lastName),
    email: useSignUpStore((state) => state.email),
    phoneNumber: useSignUpStore((state) => state.phoneNumber),
    role: useSignUpStore((state) => state.role),
  };

  //!define the default keys and values for the form
  const defaultValues =
    InfoFormData.role === "teacher"
      ? {
          specialties: [],
          diplomeFile: "",
          identityFileFront: "",
          identityFileBack: "",
          password: "",
          confirmPassword: "",
        }
      : {
          branch: "",
          class: "",
          password: "",
          confirmPassword: "",
        };

  //!define the form and extract the register and handleSubmit , formState: { errors }
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignUpDetailsSchemaType>({
    resolver: zodResolver(SignUpDetailsSchema),
    defaultValues,
  });

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  const handleClassChange = (value: keyof typeof studentClassesAndBranches) => {
    setSelectedClass(value);
    setAvailableBranches(studentClassesAndBranches[value] ?? []);
    setValue("class", value);
    setValue("branch", "");
  };

  const handleBranchChange = (value: string) => {
    setValue("branch", value);
  };

  // console.log("errors", errors);
  //$ the actual form handler
  async function onSubmit(data: SignUpDetailsSchemaType) {
    if (data.role === "teacher") {
      //REVIEW upload the files and get the urls
      await handleTeacherSubmit(data);
      localStorage.setItem("signedUp", "true");
    }

    if (data.role === "student") {
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      if (!selectedClass) {
        toast.error("Please select a class");
        return;
      }

      if (
        !data.branch &&
        availableBranches.length != 1 &&
        availableBranches[0] != "Aucune filière"
      ) {
        toast.error("Please select a branch");
        return;
      }
      try {
        const formData = new FormData();
        Object.entries({
          ...InfoFormData,
          ...data,
          class: selectedClass,
          branch: data.branch ?? "Aucune filière",
        }).forEach(([key, value]) => formData.append(key, value ?? ""));

        //call the server action
        const result: { success: boolean; message?: string; token?: string } =
          await signUpStudent(formData);
        if (!result.success) {
          toast.error(result.message);
          router.push("/sign-up/fail-auth");
          return;
        }
        if (result.success && result.token) {
          localStorage.setItem("token", result.token);
          localStorage.setItem("signedUp", "true");
          router.push("/sign-up/verify-email");
          return;
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong.");
        router.push("/sign-up/fail-auth");
      }
    }
  }

  async function handleTeacherSubmit(data: SignUpDetailsSchemaType) {
    try {
      if (data.role !== "teacher") {
        return;
      }
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }

      toast.loading("Uploading files...");
      let diplomeFile: File | null = null;
      let identityFileFront: File | null = null;
      let identityFileBack: File | null = null;

      diplomeFile = (data.diplomeFile as FileList)[0];
      identityFileFront = (data.identityFileFront as FileList)[0];
      identityFileBack = (data.identityFileBack as FileList)[0];

      if (!data.specialties) {
        toast.error("Please select at least one specialty");
        return;
      }

      if (!diplomeFile || !identityFileFront || !identityFileBack) {
        toast.error("Please upload all files");
        return;
      }

      const formData = new FormData();

      Object.entries(InfoFormData).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
      });

      formData.append("role", "teacher");
      formData.append("specialties", JSON.stringify(data.specialties));

      formData.append("diplomeFile", diplomeFile);
      formData.append("identityFileFront", identityFileFront);
      formData.append("identityFileBack", identityFileBack);
      formData.append("password", data.password);

      const result = await signUpTeacher(formData);

      if (!result.success) {
        toast.dismiss();
        toast.error(result.message ?? "Registration failed");
        router.push("/sign-up/fail-auth");
        return;
      }
      toast.dismiss();
      router.push("/sign-up/waitlist");
    } catch (error) {
      toast.dismiss();
      console.error("Teacher registration error:", error);
      toast.error("Something went wrong during registration");
      router.push("/sign-up/fail-auth");
    }
  }

  //!return the form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {/* Teacher Fields */}
      {InfoFormData.role === "teacher" && (
        <>
          <Input
            {...register("role")}
            value={InfoFormData.role}
            type="hidden"
          />
          <SpecialtiesPicker
            onChange={(specialties) => setValue("specialties", specialties)}
          />

          <div className="flex flex-col gap-1">
            <Label>Recto de la carte d&apos;identité</Label>
            <Input
              type="file"
              {...register("identityFileFront")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {"identityFileFront" in errors && errors.identityFileFront && (
              <p className="text-red-500">
                {errors.identityFileFront?.message?.toString()}
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Verso de la carte d&apos;identité</Label>
            <Input
              type="file"
              {...register("identityFileBack")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {"identityFileBack" in errors && errors.identityFileBack && (
              <p className="text-red-500">
                {errors.identityFileBack?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Diplôme</Label>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register("diplomeFile")}
            />
            {"diplomeFile" in errors && errors.diplomeFile && (
              <p className="text-red-500">
                {errors.diplomeFile?.message?.toString()}
              </p>
            )}
          </div>
          <h3 className="text-lg font-semibold my-2">
            Informations de connexion
          </h3>
          <div className="flex flex-col gap-1">
            <Label>Mot de passe</Label>
            <Input type="password" {...register("password")} />
            {"password" in errors && errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Confirmer le mot de passe</Label>
            <Input type="password" {...register("confirmPassword")} />
            {"confirmPassword" in errors && errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </>
      )}

      {/* Student Fields */}
      {InfoFormData.role === "student" && (
        <>
          <Input
            {...register("role")}
            value={InfoFormData.role}
            type="hidden"
          />
          <div className="flex flex-col gap-1">
            <Label>Classe</Label>
            <ClassSelector handleClassChange={handleClassChange} />
            <Input type="hidden" {...register("class")} />
            {"class" in errors && errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            {/* <BranchSelector
              handleBranchChange={handleBranchChange}
              selectedClass={
                selectedClass as keyof typeof studentClassesAndBranches
              }
              availableBranches={availableBranches}
            /> */}
            <Select
              disabled={!selectedClass || availableBranches.length <= 1}
              onValueChange={handleBranchChange}
            >
              <SelectTrigger className="w-full">
                <SelectValue
                  placeholder={
                    !selectedClass
                      ? "Sélectionnez d'abord une classe"
                      : availableBranches.length <= 1
                      ? availableBranches[0]
                      : "Sélectionnez votre filière"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {availableBranches.map((branch) => (
                  <SelectItem key={branch} value={branch}>
                    {branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="hidden" {...register("branch")} />
            {"branch" in errors && errors.branch && (
              <p className="text-red-500">{errors.branch.message}</p>
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
            <Input type="password" {...register("confirmPassword")} />
            {"confirmPassword" in errors && errors.confirmPassword && (
              <p className="text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
        </>
      )}

      {/* Button Group */}
      <div className="flex gap-3 w-full ">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.replace("/sign-up/info")}
          className=" flex-1  py-4 "
        >
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting} className=" flex-1 py-4">
          Continuer
        </Button>
      </div>
    </form>
  );
}
