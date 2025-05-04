"use client";
// import { SelectRole } from "@/app/(auth)/_components/Select";
import { SelectRole } from "@/app/(auth)/_components/SelectRole";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SignUpSchema } from "../SignUp.schema";
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
  const [signUpInfoData, setSignUpInfoData] = useState<
    Partial<SignUpBasicInfoFormSchema>
  >({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<SignUpBasicInfoFormSchema>({
    resolver: zodResolver(SignUpBasicInfoFormSchema),
    defaultValues: {
      firstName: signUpInfoData.firstName,
      lastName: signUpInfoData.lastName,
      email: signUpInfoData.email,
      phoneNumber: signUpInfoData.phoneNumber,
      role: signUpInfoData.role,
    },
  });

  useEffect(() => {
    const storedData = localStorage.getItem("signUpData");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setSignUpInfoData(parsedData);
      reset(parsedData);
    }
  }, [reset]);

  // const signUpInfoData = JSON.parse(localStorage.getItem("signUpData") ?? "{}");
  console.log(signUpInfoData);

  function onSubmit(data: SignUpBasicInfoFormSchema) {
    localStorage.setItem("signUpData", JSON.stringify(data));
    console.log(data);
    router.push("/sign-up/details");
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 w-full">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <Label>Nom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5"
            placeholder="Votre nom"
            type="text"
            {...register("firstName")}
            required
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm">{errors.firstName.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Prénom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5"
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

      <Button
        className="py-5 w-full"
        type="submit"
        // disabled={isPending}
      >
        Continuer
      </Button>
    </form>
  );
}
