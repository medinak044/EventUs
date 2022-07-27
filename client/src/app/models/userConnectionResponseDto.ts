import { AppUser } from "./appUser";
// Modeled after "UserConnectionResponseDto" from api
export class UserConnectionResponseDto extends AppUser {
    userConnectionId: number = 0
}