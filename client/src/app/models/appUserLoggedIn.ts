// Modeled after "AppUserLoggedInDto" from api
export class AppUserLoggedIn {
    id = ""
    firstName = ""
    lastName = ""
    userName = ""
    email = ""
    token = "" // Includes Id, UserName, Email in claims
    refreshToken = ""
    roles?: string[]
  dateAdded = ""
  dateAddedStr = ""
}
