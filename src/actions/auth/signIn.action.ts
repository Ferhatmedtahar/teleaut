"use server";

import { SignInSchema } from "@/lib/schemas/auth/SignIn.schema";
import { ActionState } from "@/types/ActionState";
import { z } from "zod";

export async function signInAction(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  try {
    const values = Object.fromEntries(formData.entries());
    const parsed = SignInSchema.parse(values);

    const { emailOrUsername, password } = parsed;
    console.log(emailOrUsername, password);

    // sign in with supabase
    // const { data, error } = await supabase.auth.signInWithPassword({
    //   email: emailOrUsername,
    //   password,
    // });
    // if (error) {
    //   return {
    //     state: "ERROR",
    //     error: error.message,
    //     inputs: { emailOrUsername, password },
    //   };
    // }
    return { state: "SUCCESS", error: "" };
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
