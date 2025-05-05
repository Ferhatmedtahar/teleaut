"use client";

import { signInAction } from "@/actions/auth/signIn.action";
import { SignInSchema } from "@/app/(auth)/_components/forms/signIn/SignIn.schema";
import { SelectRole } from "@/app/(auth)/_components/SelectRole";
import { Button } from "@/components/common/buttons/Button";
import { useActionState, useState } from "react";
import { z } from "zod";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";
import { Roles } from "./SignUp.schema";

export default function SignUpForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [role, setRole] = useState<Roles | null>(null);
  const [step, setStep] = useState(1);

  const [state, formAction, isPending] = useActionState(handleSubmit, {
    state: "INITIAL",
    error: "",
  });
  async function handleSubmit(prevState: any, formData: FormData) {
    setErrors({});
    let result;
    try {
      await SignInSchema.parseAsync(Object.fromEntries(formData.entries()));
      result = await signInAction(prevState, formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string[]>);
        return {
          ...prevState,
          state: "ERROR",
          error: "Validation Error",
          inputs: {
            emailOrUsername: formData.get("emailOrUsername") as string,
          },
        };
      }
    }
    return {
      ...prevState,
      state: "ERROR",
      error: "An unexpected error occurred",
      inputs: {
        emailOrUsername: formData.get("emailOrUsername") as string,
      },
    };
  }

  return (
    <form action={formAction} className="space-y-5 w-full">
      <div className="flex gap-3">
        <div className="flex flex-col gap-1">
          <Label>Nom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5"
            placeholder="Votre nom"
            type="text"
            name="firstName"
            defaultValue={state?.inputs?.emailOrUsername}
            required
          />
          {errors.emailOrUsername && (
            <p className="text-red-500 text-sm">{errors.emailOrUsername[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-1">
          <Label>Prénom</Label>
          <Input
            className="block text-sm font-medium text-gray-700  py-5"
            placeholder="Votre prénom"
            type="text"
            name="lastName"
            defaultValue={state?.inputs?.emailOrUsername}
            required
          />
          {errors.emailOrUsername && (
            <p className="text-red-500 text-sm">{errors.emailOrUsername[0]}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 ">
        <Label>Veuillez entrer votre e-mail </Label>
        <Input
          className="block text-sm font-medium text-gray-700  py-5"
          placeholder="Votre e-mail"
          type="email"
          name="email"
          defaultValue={state?.inputs?.emailOrUsername}
          required
        />
        {errors.emailOrUsername && (
          <p className="text-red-500 text-sm">{errors.emailOrUsername[0]}</p>
        )}
      </div>

      <div className=" flex flex-col gap-2">
        <Label>Veuillez entrer votre numéro de telephone</Label>

        <Input
          required
          className=" py-5 block text-sm font-medium text-gray-700"
          name="phoneNumber"
          placeholder="Votre numero de telephone"
          type="tel"
        />

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password[0]}</p>
        )}
      </div>
      <div className=" flex flex-col gap-2 w-full">
        <Label>Sélectionner votre rôle</Label>
        <SelectRole role={role} setRole={setRole} />
      </div>

      <Button
        type={step == 3 ? "submit" : "button"}
        onClick={() => setStep(step + 1)}
        className="py-5 w-full"
        disabled={isPending}
      >
        {step == 3 ? "S'inscrire" : "Suivant"}
        {/* {isPending ? "Connexion en cours..." : "Se connecter"} */}
      </Button>
    </form>
  );
}
