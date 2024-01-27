import type { UserWithSession } from "@/users/interfaces";

declare global {
  namespace Express {
    interface User extends UserWithSession {}
  }
}

declare module "express-session" {
  export interface SessionData {
    passport: {
      user: Pick<UserWithSession, "id" | "isTwoFactorAuthEnabled" | "isTwoFactorAuthApproved">;
    };
  }
}
