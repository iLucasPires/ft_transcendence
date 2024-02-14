import { ChannelType } from "../channel.entity";

export class SearchResultDto {
  name: string;
  type: ChannelType;
  tags: string[];
  imageUrl?: string;
}
