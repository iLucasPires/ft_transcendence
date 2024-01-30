import type { UserWithSession } from "@/users/interfaces";

declare module "http" {
  interface IncomingMessage {
    user?: UserWithSession;
    isAuthenticated(): this is AuthenticatedIncomingMessage;
    isUnauthenticated(): this is UnauthenticatedIncomingMessage;
  }

  interface AuthenticatedIncomingMessage extends IncomingMessage {
    user: UserWithSession;
  }

  interface UnauthenticatedIncomingMessage extends IncomingMessage {
    user?: undefined;
  }
}
