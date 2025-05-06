import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { SignUpSchemaType } from "../_components/forms/signUp/SignUp.schema";
type SignUpState = Partial<SignUpSchemaType> & {
  setData: (data: Partial<SignUpSchemaType>) => void;
};

export const useSignUpStore = create<SignUpState>()(
  persist(
    (set) => ({
      setData: (data) => set({ ...data }),
    }),
    {
      name: "signUpData-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
