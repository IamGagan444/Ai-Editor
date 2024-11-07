import { Messages } from "@/models/user.model";

export interface ApiResponse {
  status: number;
  message: string;
  success: boolean;
  isAcceptingMessages?: boolean;
  messages?: Array<Messages>;
}

export interface LoginUser {
  email: string;
  password: string;
}
