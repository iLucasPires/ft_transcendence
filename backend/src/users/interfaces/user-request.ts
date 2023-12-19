import { Request } from "express";
import { UserEntity } from "../user.entity";

export interface UserRequest extends Request {
  user: UserEntity;
}
