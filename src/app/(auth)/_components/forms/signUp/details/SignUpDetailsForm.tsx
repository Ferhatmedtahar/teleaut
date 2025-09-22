"use client";
import { signUpDoctor } from "@/actions/auth/sign-up/signUpDoctor.action";
import { signUpPatient } from "@/actions/auth/sign-up/signUpPatient.action";
import { useSignUpStore } from "@/app/(auth)/sign-up/store";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { roles } from "@/types/roles.enum";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SelectPreferredTime } from "../../../SelectPreferredTime";
import { SignUpSchema } from "../SignUp.schema";

const PatientSchema = SignUpSchema.pick({
  medicalConditions: true,
  emergencyContact: true,
  preferredTime: true,
  address: true,
  password: true,
  confirmPassword: true,
});
const DoctorSchema = SignUpSchema.pick({
  nationalIdCard: true,
  licenseFileUrl: true,
  yearsOfExperience: true,
  location: true,
  education: true,
  consultationFee: true,
  availabilityTimes: true,
  password: true,
  confirmPassword: true,
});

const SignUpDetailsSchema = z.discriminatedUnion("role", [
  PatientSchema.extend({ role: z.literal(roles.patient) }),
  DoctorSchema.extend({ role: z.literal(roles.doctor) }),
]);
type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

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

    if (signedUp && signedUp == "true" && roleLocalStorage === roles.doctor) {
      router.replace("/sign-up/waitlist");
    }
    if (signedUp && signedUp == "true" && roleLocalStorage === roles.patient) {
      router.replace("/sign-up/verify-email");
    }
  }, [router, useSignUpStore.persist?.hasHydrated]);

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
    InfoFormData.role === roles.doctor
      ? {
          role: roles.doctor as const,
          location: "",
          yearsOfExperience: "",
          nationalIdCard: "",
          licenseFileUrl: "",
          availabilityTimes: "",
          consultationFee: "",
          education: "",
          password: "",
          confirmPassword: "",
        }
      : {
          role: roles.patient as const,
          address: "",
          preferredTime: "morning" as const,
          emergencyContact: "",
          medicalConditions: "",
          password: "",
          confirmPassword: "",
        };
  //!define the form and extract the register and handleSubmit , formState: { errors }
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignUpDetailsSchemaType>({
    resolver: zodResolver(SignUpDetailsSchema),
    defaultValues,
  });

  //$ the actual form handler
  async function onSubmit(data: SignUpDetailsSchemaType) {
    console.log(data);
    if (data.role === roles.doctor) {
      await handleDoctorSubmit(data);
      localStorage.setItem("signedUp", "true");
    }
    if (data.role === roles.patient) {
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
          await signUpPatient(formData);
        console.log(result);
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

  async function handleDoctorSubmit(data: SignUpDetailsSchemaType) {
    try {
      if (data.role !== roles.doctor) {
        return;
      }

      // Check for required fields and show toast messages
      if (!data.location?.trim()) {
        toast.error("La localisation est requise");
        return;
      }
      if (!data.yearsOfExperience) {
        toast.error("Les années d'expérience sont requises");
        return;
      }
      if (!data.nationalIdCard?.trim()) {
        toast.error("La carte d'identité nationale est requise");
        return;
      }
      if (!data.licenseFileUrl?.trim()) {
        toast.error("L'URL du fichier de licence est requise");
        return;
      }
      if (!data.availabilityTimes?.trim()) {
        toast.error("Les horaires de disponibilité sont requis");
        return;
      }
      if (!data.consultationFee || data.consultationFee === 0) {
        toast.error("Les frais de consultation sont requis");
        return;
      }
      if (!data.education?.trim()) {
        toast.error("L'éducation est requise");
        return;
      }
      if (!data.password?.trim()) {
        toast.error("Le mot de passe est requis");
        return;
      }
      if (!data.confirmPassword?.trim()) {
        toast.error("La confirmation du mot de passe est requise");
        return;
      }

      if (data.password !== data.confirmPassword) {
        toast.error("Les mots de passe ne correspondent pas");
        return;
      }

      const formData = new FormData();

      Object.entries(InfoFormData).forEach(([key, value]) => {
        formData.append(key, String(value ?? ""));
      });
      formData.append("role", roles.doctor);
      formData.append("location", data.location ?? "");
      formData.append(
        "yearsOfExperience",
        String(data.yearsOfExperience ?? "")
      );
      formData.append("nationalIdCard", data.nationalIdCard ?? "");
      formData.append("licenseFileUrl", data.licenseFileUrl ?? "");
      formData.append("availabilityTimes", data.availabilityTimes ?? "");
      formData.append("consultationFee", String(data.consultationFee ?? ""));
      formData.append("education", data.education ?? "");
      formData.append("password", data.password);
      //review
      formData.append("role", roles.doctor);
      // formData.append("specialties", JSON.stringify(data.specialties));

      // formData.append("diplomeFile", diplomeFile);
      // formData.append("identityFileFront", identityFileFront);
      // formData.append("identityFileBack", identityFileBack);
      formData.append("password", data.password);

      const result = await signUpDoctor(formData);

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
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Details personnels</h1>
        <p className="text-lg">
          Veuillez créer un compte pour accéder à nos ressources en ligne
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
        {/* Teacher/Doctor Fields */}
        {InfoFormData.role === roles.doctor && (
          <>
            <Input
              {...register("role")}
              value={InfoFormData.role}
              type="hidden"
            />
            {/* <SpecialtiesPicker
            onChange={(specialties) => setValue("specialties", specialties)}
          /> */}

            {/* Two column grid for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <Label>Location *</Label>
                <Input
                  type="text"
                  {...register("location")}
                  placeholder="EPH Laghouat"
                  required
                />
                {"location" in errors && errors.location && (
                  <p className="text-red-500">
                    {errors.location?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Years of Experience *</Label>
                <Input
                  type="number"
                  {...register("yearsOfExperience")}
                  placeholder="0"
                  required
                />
                {"yearsOfExperience" in errors && errors.yearsOfExperience && (
                  <p className="text-red-500">
                    {errors.yearsOfExperience?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>بطاقة التعريف الوطنية *</Label>
                <Input
                  type="text"
                  {...register("nationalIdCard")}
                  placeholder="123456789123456789"
                  required
                />
                {"nationalIdCard" in errors && errors.nationalIdCard && (
                  <p className="text-red-500">
                    {errors.nationalIdCard?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>License File URL *</Label>
                <Input
                  type="url"
                  {...register("licenseFileUrl")}
                  placeholder="e.g. https://example.com/license.pdf"
                  required
                />
                {"licenseFileUrl" in errors && errors.licenseFileUrl && (
                  <p className="text-red-500">
                    {errors.licenseFileUrl?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Available Times *</Label>
                <Input
                  type="text"
                  {...register("availabilityTimes")}
                  placeholder="e.g. 9:00-12:00, 14:00-17:00"
                  required
                />
                {"availabilityTimes" in errors && errors.availabilityTimes && (
                  <p className="text-red-500">
                    {errors.availabilityTimes?.message?.toString()}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <Label>Consultation Fee *</Label>
                <Input
                  type="number"
                  {...register("consultationFee")}
                  placeholder="Amount in your currency"
                  required
                />
                {"consultationFee" in errors && errors.consultationFee && (
                  <p className="text-red-500">
                    {errors.consultationFee?.message?.toString()}
                  </p>
                )}
              </div>
            </div>

            {/* Full width fields */}
            <div className="flex flex-col gap-1">
              <Label>Education (comma separated) *</Label>
              <Input
                type="text"
                {...register("education")}
                placeholder="e.g. MD from Harvard Medical School, Residency at Johns Hopkins"
                required
              />
              {"education" in errors && errors.education && (
                <p className="text-red-500">
                  {errors.education?.message?.toString()}
                </p>
              )}
            </div>

            <h3 className="text-lg font-semibold my-2">
              Informations de connexion
            </h3>

            {/* Password fields in grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1">
                <Label>Mot de passe *</Label>
                <Input type="password" {...register("password")} required />
                {"password" in errors && errors.password && (
                  <p className="text-red-500">{errors.password.message}</p>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <Label>Confirmer le mot de passe *</Label>
                <Input
                  type="password"
                  {...register("confirmPassword")}
                  required
                />
                {"confirmPassword" in errors && errors.confirmPassword && (
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* Student/Patient Fields */}
        {InfoFormData.role === roles.patient && (
          <>
            <Input
              {...register("role")}
              value={InfoFormData.role}
              type="hidden"
            />

            {/* Two column grid for larger screens */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
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
              {/*TODO */}

              <div className=" flex flex-col gap-2 w-full">
                <Label>Preferred Consultation Time</Label>
                <Controller
                  control={control}
                  name="preferredTime"
                  render={({ field }) => (
                    <SelectPreferredTime
                      value={field.value || ""}
                      onChange={field.onChange}
                    />
                  )}
                />
                {"preferredTime" in errors && errors.preferredTime && (
                  <p className="text-red-500">{errors.preferredTime.message}</p>
                )}
              </div>

              <div className="flex flex-col gap-1 w-full lg:col-span-2 ">
                <Label>Emergency Contact</Label>
                <Input
                  type="text"
                  {...register("emergencyContact")}
                  placeholder="Name and phone number"
                />
                {"emergencyContact" in errors && errors.emergencyContact && (
                  <p className="text-red-500">
                    {errors.emergencyContact.message}
                  </p>
                )}
              </div>
            </div>

            {/* Full width field */}
            <div className="flex flex-col gap-1">
              <Label>Medical Conditions (comma separated)</Label>
              <Input
                type="text"
                {...register("medicalConditions")}
                placeholder="e.g. Diabetes, Hypertension, Asthma"
              />
              {"medicalConditions" in errors && errors.medicalConditions && (
                <p className="text-red-500">
                  {errors.medicalConditions.message}
                </p>
              )}
            </div>

            {/* Password fields in grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
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
                  <p className="text-red-500">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
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
          <Button
            type="submit"
            disabled={isSubmitting}
            className=" flex-1 py-4"
          >
            Continuer
          </Button>
        </div>
      </form>{" "}
    </>
  );
}
// "use client";
// import { signUpDoctor } from "@/actions/auth/sign-up/signUpDoctor.action";
// import { signUpPatient } from "@/actions/auth/sign-up/signUpPatient.action";
// import { useSignUpStore } from "@/app/(auth)/sign-up/store";
// import { Button } from "@/components/common/buttons/Button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { roles } from "@/types/roles.enum";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { useEffect } from "react";
// import { Controller, useForm } from "react-hook-form";
// import { toast } from "sonner";
// import { z } from "zod";
// import { SelectPreferredTime } from "../../../SelectPreferredTime";
// import { SignUpSchema } from "../SignUp.schema";

// const PatientSchema = SignUpSchema.pick({
//   medicalConditions: true,
//   emergencyContact: true,
//   preferredTime: true,
//   address: true,
//   password: true,
//   confirmPassword: true,
// });
// const DoctorSchema = SignUpSchema.pick({
//   nationalIdCard: true,
//   licenseFileUrl: true,
//   yearsOfExperience: true,
//   location: true,
//   education: true,
//   consultationFee: true,
//   availabilityTimes: true,
//   password: true,
//   confirmPassword: true,
// });

// const SignUpDetailsSchema = z.discriminatedUnion("role", [
//   PatientSchema.extend({ role: z.literal(roles.patient) }),
//   DoctorSchema.extend({ role: z.literal(roles.doctor) }),
// ]);
// type SignUpDetailsSchemaType = z.infer<typeof SignUpDetailsSchema>;

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

//     if (signedUp && signedUp == "true" && roleLocalStorage === roles.doctor) {
//       router.replace("/sign-up/waitlist");
//     }
//     if (signedUp && signedUp == "true" && roleLocalStorage === roles.patient) {
//       router.replace("/sign-up/verify-email");
//     }
//   }, [router, useSignUpStore.persist?.hasHydrated]);

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
//     InfoFormData.role === roles.doctor
//       ? {
//           role: roles.doctor as const,
//           location: "",
//           yearsOfExperience: "",
//           nationalIdCard: "",
//           licenseFileUrl: "",
//           availabilityTimes: "",
//           consultationFee: "",
//           education: "",
//           password: "",
//           confirmPassword: "",
//         }
//       : {
//           role: roles.patient as const,
//           address: "",
//           preferredTime: "morning" as const,
//           emergencyContact: "",
//           medicalConditions: "",
//           password: "",
//           confirmPassword: "",
//         };
//   //!define the form and extract the register and handleSubmit , formState: { errors }
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors, isSubmitting },
//     setValue,
//   } = useForm<SignUpDetailsSchemaType>({
//     resolver: zodResolver(SignUpDetailsSchema),
//     defaultValues,
//   });

//   //$ the actual form handler
//   async function onSubmit(data: SignUpDetailsSchemaType) {
//     console.log(data);
//     if (data.role === roles.doctor) {
//       await handleDoctorSubmit(data);
//       localStorage.setItem("signedUp", "true");
//     }
//     if (data.role === roles.patient) {
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
//           await signUpPatient(formData);
//         console.log(result);
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

//   async function handleDoctorSubmit(data: SignUpDetailsSchemaType) {
//     try {
//       if (data.role !== roles.doctor) {
//         return;
//       }
//       if (data.password !== data.confirmPassword) {
//         toast.error("Les mots de passe ne correspondent pas");
//         return;
//       }

//       const formData = new FormData();

//       Object.entries(InfoFormData).forEach(([key, value]) => {
//         formData.append(key, String(value ?? ""));
//       });
//       formData.append("role", roles.doctor);
//       formData.append("location", data.location ?? "");
//       formData.append(
//         "yearsOfExperience",
//         String(data.yearsOfExperience ?? "")
//       );
//       formData.append("nationalIdCard", data.nationalIdCard ?? "");
//       formData.append("licenseFileUrl", data.licenseFileUrl ?? "");
//       formData.append("availabilityTimes", data.availabilityTimes ?? "");
//       formData.append("consultationFee", String(data.consultationFee ?? ""));
//       formData.append("education", data.education ?? "");
//       formData.append("password", data.password);
//       //review
//       formData.append("role", roles.doctor);
//       // formData.append("specialties", JSON.stringify(data.specialties));

//       // formData.append("diplomeFile", diplomeFile);
//       // formData.append("identityFileFront", identityFileFront);
//       // formData.append("identityFileBack", identityFileBack);
//       formData.append("password", data.password);

//       const result = await signUpDoctor(formData);

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
//     <>
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold">Details personnels</h1>
//         <p className="text-lg">
//           Veuillez créer un compte pour accéder à nos ressources en ligne
//         </p>
//       </div>
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
//         {/* Teacher/Doctor Fields */}
//         {InfoFormData.role === roles.doctor && (
//           <>
//             <Input
//               {...register("role")}
//               value={InfoFormData.role}
//               type="hidden"
//             />
//             {/* <SpecialtiesPicker
//             onChange={(specialties) => setValue("specialties", specialties)}
//           /> */}

//             {/* Two column grid for larger screens */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//               <div className="flex flex-col gap-1">
//                 <Label>Location</Label>
//                 <Input
//                   type="text"
//                   {...register("location")}
//                   placeholder="EPH Laghouat"
//                 />
//                 {"location" in errors && errors.location && (
//                   <p className="text-red-500">
//                     {errors.location?.message?.toString()}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <Label>Years of Experience</Label>
//                 <Input
//                   type="number"
//                   {...register("yearsOfExperience")}
//                   placeholder="0"
//                 />
//                 {"yearsOfExperience" in errors && errors.yearsOfExperience && (
//                   <p className="text-red-500">
//                     {errors.yearsOfExperience?.message?.toString()}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <Label>بطاقة التعريف الوطنية</Label>
//                 <Input
//                   type="text"
//                   {...register("nationalIdCard")}
//                   placeholder="123456789123456789"
//                 />
//                 {"nationalIdCard" in errors && errors.nationalIdCard && (
//                   <p className="text-red-500">
//                     {errors.nationalIdCard?.message?.toString()}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <Label>License File URL</Label>
//                 <Input
//                   type="url"
//                   {...register("licenseFileUrl")}
//                   placeholder="e.g. https://example.com/license.pdf"
//                 />
//                 {"licenseFileUrl" in errors && errors.licenseFileUrl && (
//                   <p className="text-red-500">
//                     {errors.licenseFileUrl?.message?.toString()}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <Label>Available Times</Label>
//                 <Input
//                   type="text"
//                   {...register("availabilityTimes")}
//                   placeholder="e.g. 9:00-12:00, 14:00-17:00"
//                 />
//                 {"availabilityTimes" in errors && errors.availabilityTimes && (
//                   <p className="text-red-500">
//                     {errors.availabilityTimes?.message?.toString()}
//                   </p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1">
//                 <Label>Consultation Fee</Label>
//                 <Input
//                   type="number"
//                   {...register("consultationFee")}
//                   placeholder="Amount in your currency"
//                 />
//                 {"consultationFee" in errors && errors.consultationFee && (
//                   <p className="text-red-500">
//                     {errors.consultationFee?.message?.toString()}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Full width fields */}
//             <div className="flex flex-col gap-1">
//               <Label>Education (comma separated)</Label>
//               <Input
//                 type="text"
//                 {...register("education")}
//                 placeholder="e.g. MD from Harvard Medical School, Residency at Johns Hopkins"
//               />
//               {"education" in errors && errors.education && (
//                 <p className="text-red-500">
//                   {errors.education?.message?.toString()}
//                 </p>
//               )}
//             </div>

//             <h3 className="text-lg font-semibold my-2">
//               Informations de connexion
//             </h3>

//             {/* Password fields in grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//               <div className="flex flex-col gap-1">
//                 <Label>Mot de passe</Label>
//                 <Input type="password" {...register("password")} />
//                 {"password" in errors && errors.password && (
//                   <p className="text-red-500">{errors.password.message}</p>
//                 )}
//               </div>
//               <div className="flex flex-col gap-1">
//                 <Label>Confirmer le mot de passe</Label>
//                 <Input type="password" {...register("confirmPassword")} />
//                 {"confirmPassword" in errors && errors.confirmPassword && (
//                   <p className="text-red-500">
//                     {errors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Student/Patient Fields */}
//         {InfoFormData.role === roles.patient && (
//           <>
//             <Input
//               {...register("role")}
//               value={InfoFormData.role}
//               type="hidden"
//             />

//             {/* Two column grid for larger screens */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 ">
//               <div className="flex flex-col gap-1">
//                 <Label>Address</Label>
//                 <Input
//                   type="text"
//                   {...register("address")}
//                   placeholder="Your full address"
//                 />
//                 {"address" in errors && errors.address && (
//                   <p className="text-red-500">{errors.address.message}</p>
//                 )}
//               </div>
//               {/*TODO */}

//               <div className=" flex flex-col gap-2 w-full">
//                 <Label>Preferred Consultation Time</Label>
//                 <Controller
//                   control={control}
//                   name="preferredTime"
//                   render={({ field }) => (
//                     <SelectPreferredTime
//                       value={field.value || ""}
//                       onChange={field.onChange}
//                     />
//                   )}
//                 />
//                 {"preferredTime" in errors && errors.preferredTime && (
//                   <p className="text-red-500">{errors.preferredTime.message}</p>
//                 )}
//               </div>

//               <div className="flex flex-col gap-1 w-full lg:col-span-2 ">
//                 <Label>Emergency Contact</Label>
//                 <Input
//                   type="text"
//                   {...register("emergencyContact")}
//                   placeholder="Name and phone number"
//                 />
//                 {"emergencyContact" in errors && errors.emergencyContact && (
//                   <p className="text-red-500">
//                     {errors.emergencyContact.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Full width field */}
//             <div className="flex flex-col gap-1">
//               <Label>Medical Conditions (comma separated)</Label>
//               <Input
//                 type="text"
//                 {...register("medicalConditions")}
//                 placeholder="e.g. Diabetes, Hypertension, Asthma"
//               />
//               {"medicalConditions" in errors && errors.medicalConditions && (
//                 <p className="text-red-500">
//                   {errors.medicalConditions.message}
//                 </p>
//               )}
//             </div>

//             {/* Password fields in grid */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
//               <div className="flex flex-col gap-1">
//                 <Label>Mot de passe</Label>
//                 <Input type="password" {...register("password")} />
//                 {"password" in errors && errors.password && (
//                   <p className="text-red-500">{errors.password.message}</p>
//                 )}
//               </div>
//               <div className="flex flex-col gap-1">
//                 <Label>Confirmer le mot de passe</Label>
//                 <Input type="password" {...register("confirmPassword")} />
//                 {"confirmPassword" in errors && errors.confirmPassword && (
//                   <p className="text-red-500">
//                     {errors.confirmPassword.message}
//                   </p>
//                 )}
//               </div>
//             </div>
//           </>
//         )}

//         {/* Button Group */}
//         <div className="flex gap-3 w-full ">
//           <Button
//             type="button"
//             variant="outline"
//             onClick={() => router.replace("/sign-up/info")}
//             className=" flex-1  py-4 dark:hover:text-white/90"
//           >
//             Back
//           </Button>
//           <Button
//             type="submit"
//             disabled={isSubmitting}
//             className=" flex-1 py-4"
//           >
//             Continuer
//           </Button>
//         </div>
//       </form>{" "}
//     </>
//   );
// }
