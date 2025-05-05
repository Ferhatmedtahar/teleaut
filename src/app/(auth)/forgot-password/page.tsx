"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/(root)/chats/_components/ui/card";
import { Input } from "@/app/(root)/chats/_components/ui/input";
import { Label } from "@/app/(root)/chats/_components/ui/label";
import { Button } from "@/components/common/buttons/Button";
import { useState } from "react";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // throw new Error("Failed to send email");
      // Call function to send forgot password email
      toast.success("Password reset link sent to your email", {
        duration: 5000,
        description: "Check your inbox",
      });
    } catch (err) {
      toast.error("Failed to send email", {
        description: "Please try again later",
        duration: 5000,
      });
      setError("Failed to send email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#355869] w-full relative">
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 lg:rounded-tl-[6rem]">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email address to receive a password reset link
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-red-50 text-red-500 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                Send reset link
              </Button>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
}
