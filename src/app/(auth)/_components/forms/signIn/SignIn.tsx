"use client";

import { signInAction } from "@/actions/auth/sign-in/signIn.action";
import { SignInSchema } from "@/app/(auth)/_components/forms/signIn/SignIn.schema";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../../../components/common/buttons/Button";
import { Input } from "../../../../../components/ui/input";
import { Label } from "../../../../../components/ui/label";

export default function SignInForm() {
  const router = useRouter();
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
      if (result.state == "SUCCESS") {
        toast.success("Connexion réussie");
        router.push("/");
      } else {
        toast.error("Email ou mot de passe incorrect");
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors = error.flatten().fieldErrors;
        setErrors(fieldErrors as unknown as Record<string, string[]>);
        return {
          ...prevState,
          state: "ERROR",
          error: "Validation Error",
          inputs: {
            email: formData.get("email") as string,
          },
        };
      }
    }
    return {
      ...prevState,
      state: "ERROR",
      error: "An unexpected error occurred",
      inputs: {
        email: formData.get("email") as string,
      },
    };
  }

  return (
    <form action={formAction} className="space-y-4 w-full">
      <div className="flex flex-col gap-2 ">
        <Label>E-mail</Label>
        <Input
          className="block text-sm font-medium text-gray-700  py-5"
          placeholder="Votre E-mail d'inscription"
          type="text"
          name="email"
          defaultValue={state?.inputs?.email}
          required
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email[0]}</p>
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
            className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center focus:ouline-none"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <FiEye className="h-5 w-5 text-gray-500" />
            ) : (
              <FiEyeOff className="h-5 w-5 text-gray-500" />
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
            href="sign-up/info"
            className="text-blue-600 hover:text-blue-800 font-medium transition duration-200"
          >
            Créez-en un
          </Link>
        </p>
      </div>
    </form>
  );
}
