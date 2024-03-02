export class SetChannelPasswordDto {
  channelId: string;
  currentPassword?: string;
  newPassword: string;
}
