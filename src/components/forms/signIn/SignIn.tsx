"use client";

import { signInAction } from "@/actions/auth/signIn.action";
import { SignInSchema } from "@/components/forms/signIn/SignIn.schema";
import Link from "next/link";
import { useActionState, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { z } from "zod";
import { Button } from "../../common/buttons/Button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";

export default function SignInForm() {
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
    <form action={formAction} className="space-y-4 w-full">
      <div className="flex flex-col gap-2 ">
        <Label>Nom d'utilisateur ou e-mail</Label>
        <Input
          className="block text-sm font-medium text-gray-700  py-5"
          placeholder="Votre nom d'utilisateur ou e-mail"
          type="text"
          name="emailOrUsername"
          defaultValue={state?.inputs?.emailOrUsername}
          required
        />
        {errors.emailOrUsername && (
          <p className="text-red-500 text-sm">{errors.emailOrUsername[0]}</p>
        )}
      </div>

      <div className=" flex flex-col gap-2">
        <Label>Mot de passe</Label>
        <div className="relative">
          <Input
            required
            className=" py-5 block text-sm font-medium text-gray-700"
            name="password"
            placeholder="Votre mot de passe"
            type={showPassword ? "text" : "password"}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center focus:ouline-none focus:ring focus:ring-primary-400 border-0"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEyeOff className="h-5 w-5 text-gray-500" />
            ) : (
              <FiEye className="h-5 w-5 text-gray-500" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password[0]}</p>
        )}
      </div>
      <div>
        <div className="flex justify-end mt-1">
          <Link
            href="forgot-password"
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-all duration-300 "
          >
            Mot de passe oublié ?
          </Link>
        </div>
      </div>

      <Button type="submit" className="py-5 w-full">
        {isPending ? "Connexion en cours..." : "Se connecter"}
      </Button>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Vous n'avez pas de compte ?{" "}
          <Link
            href="sign-up"
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Créez-en un
          </Link>
        </p>
      </div>
    </form>
  );
}
