"use client";
import { resetPassword } from "@/actions/auth/reset-password/resetPassword.action";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(root)/chats/_components/ui/card";
import { Button } from "@/components/common/buttons/Button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { toast } from "sonner";
import { ResetPasswordSchema } from "./resetPassword.schema";

export default function ResetPasswordForm({ id }: { readonly id: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchema>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  async function onSubmit(data: ResetPasswordSchema) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    // console.log(data);
    const result = await resetPassword(formData);

    if (result.success) {
      toast.success("Password updated successfully", {
        duration: 7000,
        description: "login with your new password",
      });
      router.push("/sign-in");
    } else {
      toast.error("Failed to update password", {
        description: "Please try again later",
        duration: 7000,
      });
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Reinitialiser le mot de passe
        </CardTitle>
        <CardDescription className="text-center">
          Entrez votre novelle mot de passe et confirmez
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className=" flex flex-col gap-2">
            <Label>Mot de passe</Label>
            <div className="relative">
              <Input
                required
                className=" py-5 block text-sm font-medium text-gray-700"
                {...register("password")}
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
            {"password" in errors && errors && (
              <div className="text-red-500 text-sm">
                {errors.password?.message}
              </div>
            )}
          </div>
          <div className=" flex flex-col gap-2">
            <Label>Confirmer votre mot de passe</Label>
            <div className="relative">
              <Input
                required
                className=" py-5 block text-sm font-medium text-gray-700"
                {...register("confirmPassword")}
                placeholder="Confirmer votre mot de passe"
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center justify-center focus:ouline-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FiEye className="h-5 w-5 text-gray-500" />
                ) : (
                  <FiEyeOff className="h-5 w-5 text-gray-500" />
                )}
              </button>
            </div>
            {"confirmPassword" in errors && errors && (
              <div className="text-red-500 text-sm">
                {errors.confirmPassword?.message}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full py-5" disabled={isSubmitting}>
            {isSubmitting
              ? "Envoi en cours..."
              : "Souvger le nouveau mot de passe"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
