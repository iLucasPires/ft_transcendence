import { ChannelType } from "../channel.entity";

export class SearchResultDto {
  id: string;
  name: string;
  type: ChannelType;
  tags: string[];
  imageUrl?: string;
}
