// Modeled after "AuthResult" from api
export class AuthResult {
    token = ""
    refreshToken = ""
    success?: Boolean
    errors?: String[]
}