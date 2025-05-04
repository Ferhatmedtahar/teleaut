// "use client";
// // import { SelectRole } from "@/app/(auth)/_components/Select";
// import { SelectRole } from "@/app/(auth)/_components/SelectRole";
// import { Button } from "@/components/common/buttons/Button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Controller, useForm } from "react-hook-form";
// import { z } from "zod";
// import { SignUpSchema } from "../SignUp.schema";
// const SignUpBasicInfoFormSchema = SignUpSchema.pick({});
// type SignUpBasicInfoFormSchema = z.infer<typeof SignUpBasicInfoFormSchema>;
// export default function SignUpDetailsForm() {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<SignUpBasicInfoFormSchema>({
//     resolver: zodResolver(SignUpBasicInfoFormSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       email: "",
//       phoneNumber: "",
//     },
//   });

//   function onSubmit(data: SignUpBasicInfoFormSchema) {
//     console.log(data);
//     router.push("/sign-up/step-2");
//   }
//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
//       <div className="flex gap-3">
//         <div className="flex flex-col gap-1">
//           <Label>Nom</Label>
//           <Input
//             className="block text-sm font-medium text-gray-700  py-5"
//             placeholder="Votre nom"
//             type="text"
//             {...register("firstName")}
//             required
//           />
//           {errors.firstName && (
//             <p className="text-red-500 text-sm">{errors.firstName.message}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-1">
//           <Label>Prénom</Label>
//           <Input
//             className="block text-sm font-medium text-gray-700  py-5"
//             placeholder="Votre prénom"
//             type="text"
//             {...register("lastName")}
//             required
//           />
//           {errors.lastName && (
//             <p className="text-red-500 text-sm">{errors.lastName.message}</p>
//           )}
//         </div>
//       </div>

//       <div className="flex flex-col gap-2 ">
//         <Label>Veuillez entrer votre e-mail </Label>
//         <Input
//           className="block text-sm font-medium text-gray-700  py-5"
//           placeholder="Votre e-mail"
//           type="email"
//           {...register("email")}
//           required
//         />
//         {errors.email && (
//           <p className="text-red-500 text-sm">{errors.email.message}</p>
//         )}
//       </div>

//       <div className=" flex flex-col gap-2">
//         <Label>Veuillez entrer votre numéro de telephone</Label>

//         <Input
//           required
//           className=" py-5 block text-sm font-medium text-gray-700"
//           {...register("phoneNumber")}
//           placeholder="Votre numero de telephone (+216...) "
//           type="tel"
//         />

//         {errors.phoneNumber && (
//           <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
//         )}
//       </div>
//       <div className=" flex flex-col gap-2 w-full">
//         <Label>Sélectionner votre rôle</Label>
//         <Controller
//           control={control}
//           name="role"
//           render={({ field }) => (
//             <SelectRole value={field.value} onChange={field.onChange} />
//           )}
//         />
//         {errors.role && (
//           <p className="text-red-500 text-sm">{errors.role.message}</p>
//         )}
//       </div>

//       <Button
//         className="py-5 w-full"
//         type="submit"
//         // disabled={isPending}
//       >
//         Se connecter
//       </Button>
//     </form>
//   );
// }
// "use client";

// import { SelectRole } from "@/app/(auth)/_components/SelectRole";
// import { Button } from "@/components/common/buttons/Button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useRouter } from "next/navigation";
// import { Controller, useForm, useWatch } from "react-hook-form";
// import { z } from "zod";
// import { SignUpSchema } from "../SignUp.schema";

// const SignUpBasicDetailsFormSchema = SignUpSchema.pick({});
// export default function SignUpDetailsForm() {
//   const router = useRouter();
//   const {
//     register,
//     handleSubmit,
//     control,
//     formState: { errors },
//   } = useForm<SignUpFormType>({
//     resolver: zodResolver(SignUpSchema),
//   });

//   const role = useWatch({ control, name: "role" });

//   function onSubmit(data: SignUpFormType) {
//     console.log(data);
//     router.push("/sign-up/confirmation");
//   }

//   return (
//     <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
//       {/* Name fields */}
//       <div className="flex gap-3">
//         <div className="flex flex-col gap-1 w-full">
//           <Label>Nom</Label>
//           <Input {...register("firstName")} placeholder="Votre nom" />
//           {errors.firstName && (
//             <p className="text-red-500">{errors.firstName.message}</p>
//           )}
//         </div>
//         <div className="flex flex-col gap-1 w-full">
//           <Label>Prénom</Label>
//           <Input {...register("lastName")} placeholder="Votre prénom" />
//           {errors.lastName && (
//             <p className="text-red-500">{errors.lastName.message}</p>
//           )}
//         </div>
//       </div>

//       {/* Email */}
//       <div className="flex flex-col gap-1">
//         <Label>Email</Label>
//         <Input type="email" {...register("email")} placeholder="Votre email" />
//         {errors.email && <p className="text-red-500">{errors.email.message}</p>}
//       </div>

//       {/* Phone Number */}
//       <div className="flex flex-col gap-1">
//         <Label>Numéro de téléphone</Label>
//         <Input type="tel" {...register("phoneNumber")} placeholder="+216..." />
//         {errors.phoneNumber && (
//           <p className="text-red-500">{errors.phoneNumber.message}</p>
//         )}
//       </div>

//       {/* Role */}
//       <div className="flex flex-col gap-1">
//         <Label>Rôle</Label>
//         <Controller
//           control={control}
//           name="role"
//           render={({ field }) => (
//             <SelectRole value={field.value} onChange={field.onChange} />
//           )}
//         />
//         {errors.role && <p className="text-red-500">{errors.role.message}</p>}
//       </div>

//       {/* TEACHER FIELDS */}
//       {role === "teacher" && (
//         <>
//           <div className="flex flex-col gap-1">
//             <Label>Spécialité</Label>
//             <Input {...register("specialty")} placeholder="Votre spécialité" />
//             {errors.specialty && (
//               <p className="text-red-500">{errors.specialty.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>Carte d'identité</Label>
//             <Input type="file" {...register("identityFile")} />
//             {errors.identityFile && (
//               <p className="text-red-500">{errors.identityFile.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>Diplôme PDF</Label>
//             <Input type="file" {...register("diplomeFile")} />
//             {errors.diplomeFile && (
//               <p className="text-red-500">{errors.diplomeFile.message}</p>
//             )}
//           </div>
//         </>
//       )}

//       {/* STUDENT FIELDS */}
//       {role === "student" && (
//         <>
//           <div className="flex flex-col gap-1">
//             <Label>Filière</Label>
//             <Input {...register("filiere")} placeholder="Votre filière" />
//             {errors.filiere && (
//               <p className="text-red-500">{errors.filiere.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>Classe</Label>
//             <Input {...register("classe")} placeholder="Votre classe" />
//             {errors.classe && (
//               <p className="text-red-500">{errors.classe.message}</p>
//             )}
//           </div>

//           <div className="flex flex-col gap-1">
//             <Label>Établissement</Label>
//             <Input
//               {...register("etablissement")}
//               placeholder="Nom de l'établissement"
//             />
//             {errors.etablissement && (
//               <p className="text-red-500">{errors.etablissement.message}</p>
//             )}
//           </div>

//           {/* Password */}
//           <div className="flex flex-col gap-1">
//             <Label>Mot de passe</Label>
//             <Input type="password" {...register("password")} />
//             {errors.password && (
//               <p className="text-red-500">{errors.password.message}</p>
//             )}
//           </div>
//           <div className="flex flex-col gap-1">
//             <Label>Confirmer le mot de passe</Label>
//             <Input type="password" {...register("repeatPassword")} />
//             {errors.repeatPassword && (
//               <p className="text-red-500">{errors.repeatPassword.message}</p>
//             )}
//           </div>
//         </>
//       )}

//       <Button type="submit" className="w-full py-4">
//         Continuer
//       </Button>
//     </form>
//   );
// }

// const SignUpDetailsFormSchema = SignUpSchema.pick({
//   specialty: true,
//   identityFile: true,
//   diplomeFile: true,
//   branch: true,
//   class: true,
//   residence: true,
//   password: true,
//   repeatPassword: true,
// });
"use client";

import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "../SignUp.schema";

const signupData = localStorage.getItem("signUpData");
const parsedSignupData = signupData ? JSON.parse(signupData) : null;
const role = parsedSignupData?.role;

if (role === "teacher") {
  var SignUpDetailsSchema = SignUpSchema.pick({
    specialty: true,
    identityFile: true,
    diplomeFile: true,
  });
}

if (role === "student") {
  SignUpDetailsSchema = SignUpSchema.pick({
    branch: true,
    class: true,
    residence: true,
    password: true,
    repeatPassword: true,
  });
}
type SignUpDetailsSchema = z.infer<typeof SignUpDetailsSchema>;

// type SignUpDetailsFormType = z.infer<typeof SignUpDetailsSchema>;

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
export default function SignUpDetailsForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpDetailsSchema>({
    resolver: zodResolver(SignUpDetailsSchema),
    defaultValues,
  });

  console.log(role);
  console.log(errors);
  const onSubmit = (data: SignUpDetailsSchema) => {
    console.log(data);
    const diplomeFile = (data.diplomeFile as FileList)[0];
    const identityFile = (data.identityFile as FileList)[0];

    const formData = new FormData();
    formData.append("diplomeFile", diplomeFile);
    formData.append("identityFile", identityFile);

    // Add other form data
    console.log("Form data to send", formData);

    router.push("/sign-up/confirmation");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      {/* Teacher Fields */}
      {role === "teacher" && (
        <>
          <div className="flex flex-col gap-1">
            <Label>Spécialité</Label>
            <Input {...register("specialty")} placeholder="Votre spécialité" />
            {errors.specialty && (
              <p className="text-red-500">{errors?.specialty?.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Carte d'identité (PDF)</Label>
            <Input
              type="file"
              {...register("identityFile")}
              accept=".pdf,.jpg,.jpeg,.png"
            />
            {errors.identityFile && (
              <p className="text-red-500">
                {errors.identityFile?.message?.toString()}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <Label>Diplôme (PDF)</Label>
            <Input type="file" accept=".pdf" {...register("diplomeFile")} />
            {errors.diplomeFile && (
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
          <div className="flex flex-col gap-1">
            <Label>Filière</Label>
            <Input {...register("branch")} placeholder="Votre filière" />
            {errors.branch && (
              <p className="text-red-500">{errors.branch.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Classe</Label>
            <Input {...register("class")} placeholder="Votre classe" />
            {errors.class && (
              <p className="text-red-500">{errors.class.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Établissement</Label>
            <Input
              {...register("residence")}
              placeholder="Nom de l'établissement"
            />
            {errors.residence && (
              <p className="text-red-500">{errors.residence.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Mot de passe</Label>
            <Input type="password" {...register("password")} />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Label>Confirmer le mot de passe</Label>
            <Input type="password" {...register("repeatPassword")} />
            {errors.repeatPassword && (
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
