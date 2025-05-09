export type ActionState = {
  state: "INITIAL" | "SUCCESS" | "ERROR";
  error: string;
  inputs?: {
    email: string;
    password: string;
  };
  token?: string;
};
