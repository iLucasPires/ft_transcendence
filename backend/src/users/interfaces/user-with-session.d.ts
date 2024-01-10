export interface UserWithSession {
  id: string;
  username: string;
  email: string;
  avatarUrl?: string;
  registrationComplete: boolean;
  isTwoFactorAuthEnabled: boolean;
  isTwoFactorAuthApproved?: boolean;
}
