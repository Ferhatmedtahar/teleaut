"use client";
import { forgotPassword } from "@/actions/auth/forgotPassword/forgotPassword.action";
import { ForgotPasswordSchema } from "@/app/(auth)/_components/forms/forgot-password/forgotPassword.schema";
import { Button } from "@/components/common/buttons/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  async function onSubmit(data: ForgotPasswordSchema) {
    const result = await forgotPassword(data.email);

    if (result.success) {
      toast.success(
        "Lien de réinitialisation du mot de passe envoyé à votre adresse e-mail",
        {
          duration: 10000,
          description: "Vérifiez votre boîte de réception",
        }
      );
    } else {
      toast.error("Échec de l'envoi de l'e-mail", {
        description: "Veuillez réessayer plus tard",
        duration: 7000,
      });
    }
  }
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          mot de passe oublié
        </CardTitle>
        <CardDescription className="text-center text-primary-900 dark:text-primary-100">
          Entrez votre adresse e-mail pour recevoir un lien de réinitialisation
          du mot de passe
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {"email" in errors && errors && (
            <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
              {errors.email?.message}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="Enter your email address"
              {...register("email")}
              className="py-5"
              required
            />
          </div>
          <Button
            type="submit"
            className={`w-full py-5 disabled:cursor-not-allowed`}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Envoi en cours..."
              : "Envoyer le lien de réinitialisation"}
          </Button>
        </CardContent>
      </form>
    </Card>
  );
}
