"use client";
import { verifyEmailExists } from "@/actions/auth/sign-up/verifyEmailExists.action";
import { SelectRole } from "@/app/(auth)/_components/SelectRole";
import { useSignUpStore } from "@/app/(auth)/sign-up/store";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SignUpSchema } from "../SignUp.schema";
import { roles } from "@/types/roles.enum";

const SignUpBasicInfoFormSchema = SignUpSchema.pick({
  firstName: true,
  lastName: true,
  email: true,
  phoneNumber: true,
  role: true,
});

type SignUpBasicInfoFormSchema = z.infer<typeof SignUpBasicInfoFormSchema>;

export default function SignUpBasicInfoForm() {
  const router = useRouter();
  useEffect(() => {
    if (!useSignUpStore.persist?.hasHydrated) return;
    const signedUp = localStorage.getItem("signedUp");
    const roleLocalStorage = localStorage.getItem("role");
    //REVIEW change the roles here and use constants and same them in a constant file
    if (signedUp && signedUp == "true" && roleLocalStorage === roles.teacher) {
      router.replace("/sign-up/waitlist");
    }
    if (signedUp && signedUp == "true" && roleLocalStorage === roles.student) {
      router.replace("/sign-up/verify-email");
    }
  }, [router, useSignUpStore.persist?.hasHydrated]);

  const setData = useSignUpStore((state) => state.setData);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpBasicInfoFormSchema>({
    resolver: zodResolver(SignUpBasicInfoFormSchema),
    defaultValues: {
      firstName: useSignUpStore((state) => state.firstName),
      lastName: useSignUpStore((state) => state.lastName),
      email: useSignUpStore((state) => state.email),
      phoneNumber: useSignUpStore((state) => state.phoneNumber),
      role: useSignUpStore((state) => state.role),
    },
  });

  async function onSubmit(data: SignUpBasicInfoFormSchema) {
    const userExist = await verifyEmailExists(data.email);
    if (!userExist.success) {
      toast.error(userExist.message);
      return;
    }
    localStorage.setItem("role", data.role);
    setData(data);
    router.push("/sign-up/details");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-full">
          <Label>Nom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5 w-full"
            placeholder="Votre nom"
            type="text"
            {...register("firstName")}
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <Label>Prénom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5 w-full"
            placeholder="Votre prénom"
            type="text"
            {...register("lastName")}
            required
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <Label>Veuillez entrer votre e-mail </Label>
        <Input
          className="block text-sm font-medium text-gray-700  py-5"
          placeholder="Votre e-mail"
          type="email"
          {...register("email")}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className=" flex flex-col gap-2">
        <Label>Veuillez entrer votre numéro de telephone</Label>

        <Input
          required
          className=" py-5 block text-sm font-medium text-gray-700"
          {...register("phoneNumber")}
          placeholder="Votre numero de telephone (+216...) "
          type="tel"
        />

        {errors.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>
      <div className=" flex flex-col gap-2 w-full">
        <Label>Sélectionner votre rôle</Label>
        <Controller
          control={control}
          name="role"
          render={({ field }) => (
            <SelectRole value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.role && (
          <p className="text-red-500 text-sm">{errors.role.message}</p>
        )}
      </div>

      <Button className="py-5 w-full" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Chargement..." : "Suivant"}
      </Button>
    </form>
  );
}
