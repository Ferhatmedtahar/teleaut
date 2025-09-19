"use client";
import { useSignUpStore } from "@/app/(auth)/sign-up/store";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { signUpStudent } from "@/actions/auth/sign-up/signUpStudent.action";
import { signUpTeacher } from "@/actions/auth/sign-up/signUpTeacher.action";
// import BranchSelector from "@/components/common/select/BranchSelector";
import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
import { roles } from "@/types/roles.enum";
import { toast } from "sonner";
import { SignUpSchema } from "../SignUp.schema";

const StudentSchema = SignUpSchema.pick({
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

  //$ the actual form handler
  async function onSubmit(data: SignUpDetailsSchemaType) {
    // review
    if (data.role === "teacher") {
      await handleTeacherSubmit(data);
      localStorage.setItem("signedUp", "true");
    }
    // review
    if (data.role === roles.student) {
      if (data.password !== data.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      try {
        const formData = new FormData();
        Object.entries({
          ...InfoFormData,
          ...data,
        }).forEach(([key, value]) => formData.append(key, value ?? ""));

        //!call the server action
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
        toast.error("Quelque chose s'est mal passé.");
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
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      toast.loading("Téléchargement de fichiers...");
      let diplomeFile: File | null = null;
      let identityFileFront: File | null = null;
      let identityFileBack: File | null = null;

      diplomeFile = (data.diplomeFile as FileList)[0];
      identityFileFront = (data.identityFileFront as FileList)[0];
      identityFileBack = (data.identityFileBack as FileList)[0];

      if (!data.specialties) {
        toast.error("Veuillez sélectionner au moins une spécialité");
        return;
      }

      if (!diplomeFile || !identityFileFront || !identityFileBack) {
        toast.error("Veuillez envoyer tous les fichiers");
        return;
      }

      const formData = new FormData();

      Object.entries(InfoFormData).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
      });
      //review
      formData.append("role", "teacher");
      formData.append("specialties", JSON.stringify(data.specialties));

      formData.append("diplomeFile", diplomeFile);
      formData.append("identityFileFront", identityFileFront);
      formData.append("identityFileBack", identityFileBack);
      formData.append("password", data.password);

      const result = await signUpTeacher(formData);

      if (!result.success) {
        toast.dismiss();
        toast.error(result.message ?? "L'inscription a échoué");
        router.push("/sign-up/fail-auth");
        return;
      }
      toast.dismiss();
      router.push("/sign-up/waitlist");
    } catch (error) {
      toast.dismiss();
      console.error("Teacher registration error:", error);
      toast.error("Une erreur s'est produite lors de l'inscription.");
      router.push("/sign-up/fail-auth");
    }
  }

  //!return the form
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {/* Teacher/Doctor Fields */}
      {InfoFormData.role === "teacher" && (
        <>
          <Input
            {...register("role")}
            value={InfoFormData.role}
            type="hidden"
          />
          {/* <SpecialtiesPicker
            onChange={(specialties) => setValue("specialties", specialties)}
          /> */}

          <div className="flex flex-col gap-1">
            <Label>Hospital</Label>
            <Input type="text" {...register("hospital")} />
            {"hospital" in errors && errors.hospital && (
              <p className="text-red-500">
                {errors.hospital?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Years of Experience</Label>
            <Input
              type="number"
              {...register("yearsOfExperience")}
              placeholder="0"
              // defaultValue={0}
            />
            {"yearsOfExperience" in errors && errors.yearsOfExperience && (
              <p className="text-red-500">
                {errors.yearsOfExperience?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Medical License Number</Label>
            <Input type="text" {...register("medicalLicenceNumber")} />
            {"medicalLicenceNumber" in errors &&
              errors.medicalLicenceNumber && (
                <p className="text-red-500">
                  {errors.medicalLicenceNumber?.message?.toString()}
                </p>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>License File URL</Label>
            <Input
              type="url"
              {...register("licenseFileUrl")}
              placeholder="e.g. https://example.com/license.pdf"
              // accept=".pdf,.jpg,.jpeg,.png"
            />
            {"licenseFileUrl" in errors && errors.licenseFileUrl && (
              <p className="text-red-500">
                {errors.licenseFileUrl?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Certifications (comma separated)</Label>
            <Input
              type="text"
              {...register("certifications")}
              placeholder="e.g. Board Certified Cardiologist, CPR Certified"
            />
            {"certifications" in errors && errors.certifications && (
              <p className="text-red-500">
                {errors.certifications?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Education (comma separated)</Label>
            <Input
              type="text"
              {...register("education")}
              placeholder="e.g. MD from Harvard Medical School, Residency at Johns Hopkins"
            />
            {"education" in errors && errors.education && (
              <p className="text-red-500">
                {errors.education?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Available Times (comma separated)</Label>
            <Input
              type="text"
              {...register("availabilityTimes")}
              placeholder="e.g. 9:00-12:00, 14:00-17:00"
            />
            {"availabilityTimes" in errors && errors.availabilityTimes && (
              <p className="text-red-500">
                {errors.availabilityTimes?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Consultation Fee</Label>
            <Input
              type="number"
              {...register("consultationFee")}
              placeholder="Amount in your currency"
            />
            {"consultationFee" in errors && errors.consultationFee && (
              <p className="text-red-500">
                {errors.consultationFee?.message?.toString()}
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

      {/* Student/Patient Fields */}
      {InfoFormData.role === "student" && (
        <>
          <Input
            {...register("role")}
            value={InfoFormData.role}
            type="hidden"
          />

          <div className="flex flex-col gap-1">
            <Label>Address</Label>
            <Input
              type="text"
              {...register("address")}
              placeholder="Your full address"
            />
            {"address" in errors && errors.address && (
              <p className="text-red-500">{errors.address.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Current Medications (comma separated)</Label>
            <Input
              type="text"
              {...register("currentMedications")}
              placeholder="e.g. Aspirin 100mg daily, Lisinopril 10mg"
            />
            {"currentMedications" in errors && errors.currentMedications && (
              <p className="text-red-500">
                {errors.currentMedications.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Allergies (comma separated)</Label>
            <Input
              type="text"
              {...register("allergies")}
              placeholder="e.g. Penicillin, Peanuts, Shellfish"
            />
            {"allergies" in errors && errors.allergies && (
              <p className="text-red-500">{errors.allergies.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Medical Conditions (comma separated)</Label>
            <Input
              type="text"
              {...register("medicalConditions")}
              placeholder="e.g. Diabetes, Hypertension, Asthma"
            />
            {"medicalConditions" in errors && errors.medicalConditions && (
              <p className="text-red-500">{errors.medicalConditions.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Problems & Treatments (comma separated)</Label>
            <Input
              type="text"
              {...register("problemsAndTreatments")}
              placeholder="e.g. Back pain - Physical therapy, Migraines - Medication"
            />
            {"problemsAndTreatments" in errors &&
              errors.problemsAndTreatments && (
                <p className="text-red-500">
                  {errors.problemsAndTreatments.message}
                </p>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Preferred Consultation Time</Label>
            <Input
              type="text"
              {...register("preferredConsultationTime")}
              placeholder="e.g. Morning, Afternoon, Evening"
            />
            {"preferredConsultationTime" in errors &&
              errors.preferredConsultationTime && (
                <p className="text-red-500">
                  {errors.preferredConsultationTime.message}
                </p>
              )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Emergency Contact</Label>
            <Input
              type="text"
              {...register("emergencyContact")}
              placeholder="Name and phone number"
            />
            {"emergencyContact" in errors && errors.emergencyContact && (
              <p className="text-red-500">{errors.emergencyContact.message}</p>
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
          className=" flex-1  py-4 dark:hover:text-white/90"
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
// "use client";
// import { useSignUpStore } from "@/app/(auth)/sign-up/store";
// import { Button } from "@/components/common/buttons/Button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { z } from "zod";

// import { signUpStudent } from "@/actions/auth/sign-up/signUpStudent.action";
// import { signUpTeacher } from "@/actions/auth/sign-up/signUpTeacher.action";
// // import BranchSelector from "@/components/common/select/BranchSelector";
// import { studentClassesAndBranches } from "@/lib/constants/studentClassesAndBranches";
// import { roles } from "@/types/roles.enum";
// import { toast } from "sonner";
// import { SignUpSchema } from "../SignUp.schema";
// import SpecialtiesPicker from "../SpecialtiesPicker";

// const StudentSchema = SignUpSchema.pick({
//   password: true,
//   confirmPassword: true,
// });
// const TeacherSchema = SignUpSchema.pick({
//   specialties: true,
//   diplomeFile: true,
//   identityFileFront: true,
//   identityFileBack: true,
//   password: true,
//   confirmPassword: true,
// });

// const SignUpDetailsSchema = z.discriminatedUnion("role", [
//   StudentSchema.extend({ role: z.literal("student") }),
//   TeacherSchema.extend({ role: z.literal("teacher") }),
// ]);
// type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

// const allClasses = Object.keys(studentClassesAndBranches);
// const allBranches = Object.values(studentClassesAndBranches);
// export default function SignUpDetailsForm() {
//   //! check if user has filled the informations form if not redirect him back.
//   const router = useRouter();

//   const firstName = useSignUpStore((state) => state.firstName);
//   const lastName = useSignUpStore((state) => state.lastName);
//   const email = useSignUpStore((state) => state.email);
//   const phoneNumber = useSignUpStore((state) => state.phoneNumber);
//   const role = useSignUpStore((state) => state.role);

//   // const hasHydrated = useSignUpStore.persist?.hasHydrated;
//   useEffect(() => {
//     if (!useSignUpStore.persist?.hasHydrated) return;

//     if (!firstName || !lastName || !email || !phoneNumber || !role) {
//       router.replace("/sign-up/info");
//     }
//     const signedUp = localStorage.getItem("signedUp");

//     const roleLocalStorage = localStorage.getItem("role");

//     if (signedUp && signedUp == "true" && roleLocalStorage === "teacher") {
//       router.replace("/sign-up/waitlist");
//     }
//     if (signedUp && signedUp == "true" && roleLocalStorage === "student") {
//       router.replace("/sign-up/verify-email");
//     }
//   }, [
//     // firstName,
//     // lastName,
//     router,
//     // email,
//     // phoneNumber,
//     // role,
//     useSignUpStore.persist?.hasHydrated,
//   ]);

//   //!get the prevous information form data
//   const InfoFormData = {
//     firstName: useSignUpStore((state) => state.firstName),
//     lastName: useSignUpStore((state) => state.lastName),
//     email: useSignUpStore((state) => state.email),
//     phoneNumber: useSignUpStore((state) => state.phoneNumber),
//     role: useSignUpStore((state) => state.role),
//   };

//   //!define the default keys and values for the form
//   const defaultValues =
//     InfoFormData.role === "teacher"
//       ? {
//           specialties: [],
//           diplomeFile: "",
//           identityFileFront: "",
//           identityFileBack: "",
//           password: "",
//           confirmPassword: "",
//         }
//       : {
//           password: "",
//           confirmPassword: "",
//         };

//   //!define the form and extract the register and handleSubmit , formState: { errors }
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<SignUpDetailsSchemaType>({
//     resolver: zodResolver(SignUpDetailsSchema),
//     defaultValues,
//   });

//   //$ the actual form handler
//   async function onSubmit(data: SignUpDetailsSchemaType) {
//     // review
//     if (data.role === "teacher") {
//       await handleTeacherSubmit(data);
//       localStorage.setItem("signedUp", "true");
//     }
//     // review
//     if (data.role === roles.student) {
//       if (data.password !== data.confirmPassword) {
//         toast.error("Les mots de passe ne correspondent pas");
//         return;
//       }

//       try {
//         const formData = new FormData();
//         Object.entries({
//           ...InfoFormData,
//           ...data,
//         }).forEach(([key, value]) => formData.append(key, value ?? ""));

//         //!call the server action
//         const result: { success: boolean; message?: string; token?: string } =
//           await signUpStudent(formData);
//         if (!result.success) {
//           toast.error(result.message);
//           router.push("/sign-up/fail-auth");
//           return;
//         }
//         if (result.success && result.token) {
//           localStorage.setItem("token", result.token);
//           localStorage.setItem("signedUp", "true");
//           router.push("/sign-up/verify-email");
//           return;
//         }
//       } catch (error) {
//         console.error(error);
//         toast.error("Quelque chose s'est mal passé.");
//         router.push("/sign-up/fail-auth");
//       }
//     }
//   }

//   async function handleTeacherSubmit(data: SignUpDetailsSchemaType) {
//     try {
//       if (data.role !== "teacher") {
//         return;
//       }
//       if (data.password !== data.confirmPassword) {
//         toast.error("Les mots de passe ne correspondent pas");
//         return;
//       }

//       toast.loading("Téléchargement de fichiers...");
//       let diplomeFile: File | null = null;
//       let identityFileFront: File | null = null;
//       let identityFileBack: File | null = null;

//       diplomeFile = (data.diplomeFile as FileList)[0];
//       identityFileFront = (data.identityFileFront as FileList)[0];
//       identityFileBack = (data.identityFileBack as FileList)[0];

//       if (!data.specialties) {
//         toast.error("Veuillez sélectionner au moins une spécialité");
//         return;
//       }

//       if (!diplomeFile || !identityFileFront || !identityFileBack) {
//         toast.error("Veuillez envoyer tous les fichiers");
//         return;
//       }

//       const formData = new FormData();

//       Object.entries(InfoFormData).forEach(([key, value]) => {
//         formData.append(key, String(value ?? ""));
//       });
//       //review
//       formData.append("role", "teacher");
//       formData.append("specialties", JSON.stringify(data.specialties));

//       formData.append("diplomeFile", diplomeFile);
//       formData.append("identityFileFront", identityFileFront);
//       formData.append("identityFileBack", identityFileBack);
//       formData.append("password", data.password);

//       const result = await signUpTeacher(formData);

//       if (!result.success) {
//         toast.dismiss();
//         toast.error(result.message ?? "L'inscription a échoué");
//         router.push("/sign-up/fail-auth");
//         return;
//       }
//       toast.dismiss();
//       router.push("/sign-up/waitlist");
//     } catch (error) {
//       toast.dismiss();
//       console.error("Teacher registration error:", error);
//       toast.error("Une erreur s'est produite lors de l'inscription.");
//       router.push("/sign-up/fail-auth");
//     }
//   }

//   //!return the form
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
//       {/* Teacher Fields */}
//       {InfoFormData.role === "teacher" && (
//         <>
//           <Input
//             {...register("role")}
//             value={InfoFormData.role}
//             type="hidden"
//           />
//           <SpecialtiesPicker
//             onChange={(specialties) => setValue("specialties", specialties)}
//           />

//           <div className="flex flex-col gap-1">
//             <Label>Hospital</Label>
//             <Input
//               type="text"
//               {...register("hospital")}
//               // accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {"hospital" in errors && errors.hospital && (
//               <p className="text-red-500">
//                 {errors.hospital?.message?.toString()}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>years of experience</Label>
//             <Input
//               type="text"
//               {...register("yearsOfExperience")}
//               // accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {"yearsOfExperience" in errors && errors.yearsOfExperience && (
//               <p className="text-red-500">
//                 {errors.yearsOfExperience?.message?.toString()}
//               </p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>Medical Licence Number</Label>
//             <Input
//               type="text"
//               {...register("medicalLicenceNumber")}
//               // accept=".pdf,.jpg,.jpeg,.png"
//             />
//             {"medicalLicenceNumber" in errors &&
//               errors.medicalLicenceNumber && (
//                 <p className="text-red-500">
//                   {errors.medicalLicenceNumber?.message?.toString()}
//                 </p>
//               )}
//           </div>

//           <h3 className="text-lg font-semibold my-2">
//             Informations de connexion
//           </h3>
//           <div className="flex flex-col gap-1">
//             <Label>Mot de passe</Label>
//             <Input type="password" {...register("password")} />
//             {"password" in errors && errors.password && (
//               <p className="text-red-500">{errors.password.message}</p>
//             )}
//           </div>
//           <div className="flex flex-col gap-1">
//             <Label>Confirmer le mot de passe</Label>
//             <Input type="password" {...register("confirmPassword")} />
//             {"confirmPassword" in errors && errors.confirmPassword && (
//               <p className="text-red-500">{errors.confirmPassword.message}</p>
//             )}
//           </div>
//         </>
//       )}

//       {/* Student Fields */}
//       {InfoFormData.role === "student" && (
//         <>
//           <Input
//             {...register("role")}
//             value={InfoFormData.role}
//             type="hidden"
//           />
//           {/* <div className="flex flex-col gap-1">
//             <Label>Classe</Label>
//             <ClassSelector handleClassChange={handleClassChange} />
//             <Input type="hidden" {...register("class")} />
//             {"class" in errors && errors.class && (
//               <p className="text-red-500">{errors.class.message}</p>
//             )}
//           </div> */}

//           {/* <div className="flex flex-col gap-1">
//             <Label>Filière</Label>
//             {/* <BranchSelector
//               handleBranchChange={handleBranchChange}
//               selectedClass={
//                 selectedClass as keyof typeof studentClassesAndBranches
//               }
//               availableBranches={availableBranches}
//             />
//             <Select
//               disabled={!selectedClass || availableBranches.length <= 1}
//               onValueChange={handleBranchChange}
//             >
//               <SelectTrigger className="w-full">
//                 <SelectValue
//                   placeholder={
//                     !selectedClass
//                       ? "Sélectionnez d'abord une classe"
//                       : availableBranches.length <= 1
//                       ? availableBranches[0]
//                       : "Sélectionnez votre filière"
//                   }
//                 />
//               </SelectTrigger>
//               <SelectContent>
//                 {availableBranches.map((branch) => (
//                   <SelectItem key={branch} value={branch}>
//                     {branch}
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//             <Input type="hidden" {...register("branch")} />
//             {"branch" in errors && errors.branch && (
//               <p className="text-red-500">{errors.branch.message}</p>
//             )}
//           </div> */}
//           <div className="flex flex-col gap-1">
//             <Label>Mot de passe</Label>
//             <Input type="password" {...register("password")} />
//             {"password" in errors && errors.password && (
//               <p className="text-red-500">{errors.password.message}</p>
//             )}
//           </div>
//           <div className="flex flex-col gap-1">
//             <Label>Confirmer le mot de passe</Label>
//             <Input type="password" {...register("confirmPassword")} />
//             {"confirmPassword" in errors && errors.confirmPassword && (
//               <p className="text-red-500">{errors.confirmPassword.message}</p>
//             )}
//           </div>
//         </>
//       )}

//       {/* Button Group */}
//       <div className="flex gap-3 w-full ">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => router.replace("/sign-up/info")}
//           className=" flex-1  py-4 dark:hover:text-white/90"
//         >
//           Back
//         </Button>
//         <Button type="submit" disabled={isSubmitting} className=" flex-1 py-4">
//           Continuer
//         </Button>
//       </div>
//     </form>
//   );
// }
