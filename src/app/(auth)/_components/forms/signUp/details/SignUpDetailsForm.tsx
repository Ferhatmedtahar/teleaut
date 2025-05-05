"use client";
import { useSignUpStore } from "@/app/(auth)/sign-up/store";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
});

const SignUpDetailsSchema = z.discriminatedUnion("role", [
  StudentSchema.extend({ role: z.literal("student") }),
  TeacherSchema.extend({ role: z.literal("teacher") }),
]);
type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

// Class to branch mapping
const classBranchMapping = {
  "7ème année de base": ["Aucune filière"],
  "8ème année de base": ["Aucune filière"],
  "9ème année de base": ["Aucune filière"],
  "1ère année secondaire": ["Aucune filière"],
  "2ème année secondaire": [
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
  "3ème année secondaire": [
    "Mathématiques",
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
  "4ème année secondaire (BAC)": [
    "Mathématiques",
    "Sciences expérimentales",
    "Sciences techniques",
    "Lettres",
    "Économie & gestion",
    "Sciences de l'informatique",
    "Sciences sportives",
  ],
};

const allClasses = Object.keys(classBranchMapping);
const allBranches = Object.values(classBranchMapping);
export default function SignUpDetailsForm() {
  //! check if user has filled the informations form if not redirect him back.
  const router = useRouter();

  const firstName = useSignUpStore((state) => state.firstName);
  const lastName = useSignUpStore((state) => state.lastName);
  const email = useSignUpStore((state) => state.email);
  const phoneNumber = useSignUpStore((state) => state.phoneNumber);
  const role = useSignUpStore((state) => state.role);

  const hasHydrated = useSignUpStore.persist?.hasHydrated;
  useEffect(() => {
    if (!hasHydrated) return;
    if (!firstName || !lastName || !email || !phoneNumber || !role) {
      router.replace("/sign-up/info");
    }
  }, [
    firstName,
    lastName,
    router,
    email,
    phoneNumber,
    role,
    // useSignUpStore.persist?.hasHydrated,
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
    formState: { errors },
    setValue,
  } = useForm<SignUpDetailsSchemaType>({
    resolver: zodResolver(SignUpDetailsSchema),
    defaultValues,
  });

  const [selectedClass, setSelectedClass] = useState<string>("");
  const [availableBranches, setAvailableBranches] = useState<string[]>([]);
  console.log("all classes", allClasses);
  console.log("all branches", allBranches);
  console.log(
    "selectedClass",
    selectedClass,
    "availableBranches",
    availableBranches
  );

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
    setAvailableBranches(classBranchMapping[value] ?? []);
    setValue("class", value); // ✅ sync form
    setValue("branch", ""); // ✅ reset branch when class changes
  };

  const handleBranchChange = (value: string) => {
    setValue("branch", value); // ✅ sync form
  };

  // console.log("role from the prev form ", InfoFormData.role);
  console.log("errors", errors);

  //$ the actual form handler
  function onSubmit(data: SignUpDetailsSchemaType) {
    if (data.role === "teacher") {
      const diplomeFile = (data.diplomeFile as FileList)[0];
      const identityFileFront = (data.identityFileFront as FileList)[0];
      const identityFileBack = (data.identityFileBack as FileList)[0];
      //todo upload the files and get the urls

      const formData = new FormData();
      formData.append("diplomeFile", diplomeFile);
      formData.append("identityFileFront", identityFileFront);
      formData.append("identityFileBack", identityFileBack);
      console.log("Teacher form data", { ...InfoFormData, ...data });
      router.push("/sign-up/confirmation");
    }

    if (data.role === "student") {
      // setData(data);
      console.log("student form data", { ...InfoFormData, ...data });
      router.push("/sign-up/verify-email");
    }
  }

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
          {/* <div className="flex flex-col gap-1">
            <Label>Spécialité</Label>
            <Input
              {...register("specialties")}
              placeholder="Votre spécialité"
            />
            {"specialties" in errors && errors.specialties && (
              <p className="text-red-500">{errors?.specialties?.message}</p>
            )}
          </div> */}
          <SpecialtiesPicker
            onChange={(specialties) => setValue("specialties", specialties)}
          />

          <div className="flex flex-col gap-1">
            <Label>Carte d'identité front</Label>
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
            <Label>Carte d'identité back</Label>
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
          {/* <div className="flex flex-col gap-1">
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
          </div> */}
          {/* <div className="flex flex-col gap-1">
            <Label>Classe</Label>
            <Select
              onValueChange={(value) => {
                setSelectedClass(value);
                // Reset branch when class changes
                const branchField = "branch" as const;
                register(branchField).onChange({ target: { value: "" } });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre classe" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((classOption) => (
                  <SelectItem key={classOption} value={classOption}>
                    {classOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              {...register("class")}
              type="hidden"
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setAvailableBranches(classBranchMapping[e.target.value]);
              }}
            />
            {"class" in errors && errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            <Select
              disabled={!selectedClass || availableBranches.length <= 1}
              onValueChange={(value) => {
                const branchField = "branch" as const;
                register(branchField).onChange({ target: { value } });
              }}
            >
              <SelectTrigger>
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
            <Input {...register("branch")} type="hidden" />
            {"branch" in errors && errors.branch && (
              <p className="text-red-500">{errors.branch.message}</p>
            )}
          </div> */}

          <div className="flex flex-col gap-1">
            <Label>Classe</Label>
            <Select onValueChange={handleClassChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez votre classe" />
              </SelectTrigger>
              <SelectContent>
                {allClasses.map((classOption) => (
                  <SelectItem key={classOption} value={classOption}>
                    {classOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="hidden" {...register("class")} />
            {"class" in errors && errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            <Select
              disabled={!selectedClass || availableBranches.length <= 1}
              onValueChange={handleBranchChange}
            >
              <SelectTrigger>
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
        <Button type="submit" className=" flex-1 py-4">
          Continuer
        </Button>
      </div>
    </form>
  );
}
