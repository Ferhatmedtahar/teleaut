export type ActionState = {
  state: "INITIAL" | "SUCCESS" | "ERROR";
  error: string;
  inputs?: {
    emailOrUsername: string;
    password: string;
  };
};
