import type { UserWithSession } from "@/users/interfaces";

declare module "http" {
  interface IncomingMessage {
    user: UserWithSession;
  }
}
