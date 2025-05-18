"use server";
import { SignInSchema } from "@/app/(auth)/_components/forms/signIn/SignIn.schema";
import { generateToken } from "@/app/(auth)/_lib/generateToken";
import { comparePasswords } from "@/app/(auth)/_lib/hashComparePassword";
import { VERIFICATION_STATUS } from "@/lib/constants/verificationStatus";
import { createClient } from "@/lib/supabase/server";
import { ActionState } from "@/types/ActionStateSignIn";
import { cookies } from "next/headers";
import { z } from "zod";

export async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const supabase = await createClient();
    const values = Object.fromEntries(formData.entries());
    const parsed = SignInSchema.parse(values);

    const { email, password } = parsed;
    // console.log(email, password);

    const { data, error } = await supabase
      .from("users")
      .select("email, password,role, id,verification_status")
      .eq("email", email)
      .single();
    // console.log(data, error);

    if (!data) {
      return {
        state: "ERROR",
        error: "Invalid email or password",
        inputs: { email, password },
      };
    }
    if (error) {
      return {
        state: "ERROR",
        error: "Error signing in user",
        inputs: { email, password },
      };
    }

    if (data?.verification_status !== VERIFICATION_STATUS.APPROVED) {
      return {
        state: "ERROR",
        error: "Account not verified",
        inputs: { email, password },
      };
    }

    const isPasswordCorrect = await comparePasswords(password, data?.password);
    if (!isPasswordCorrect) {
      return {
        state: "ERROR",
        error: "Invalid email or password",
        inputs: { email, password },
      };
    }
    const token = await generateToken({ id: data.id, role: data.role });
    const cookiesStore = await cookies();
    cookiesStore.delete("token");
    cookiesStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    // console.log(token);

    return { state: "SUCCESS", error: "", token };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        state: "ERROR",
        error: "Validation failed",
        // inputs: error.flatten().fieldErrors,
      };
    }

    return {
      state: "ERROR",
      error: "Something went wrong",
    };
  }
}
