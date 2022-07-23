import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUserRegister } from '../models/appUserRegister';
import { AppUserLogin } from '../models/appUserLogin';
import { AppUserLoggedIn } from '../models/appUserLoggedIn';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private accountControllerUrl: string = "Account" // AccountController
  private currentUserSource = new ReplaySubject<any>(1); // <AppUserLoggedIn>
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient) { }

  getUserById(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>
      (`${environment.apiUrl}/${this.accountControllerUrl}/GetUserById/${userId}`)
  }

  getAllUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>
      (`${environment.apiUrl}/${this.accountControllerUrl}/GetAllUsers`)
  }

  updateUser(appUser: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>
      (`${environment.apiUrl}/${this.accountControllerUrl}/UpdateUser`, appUser)
  }

  register(registerForm: AppUserRegister) {
    return this.http.post
      (`${environment.apiUrl}/${this.accountControllerUrl}/Register`, registerForm)
  }

  deleteUser(userId: string) {
    return this.http.delete
      (`${environment.apiUrl}/${this.accountControllerUrl}/DeleteUser/${userId}`)
  }

  login(loginForm: AppUserLogin) {
    return this.http.post
      (`${environment.apiUrl}/${this.accountControllerUrl}/Login`, loginForm).pipe(
        map((res: any) => {
          const user = res;
          if (user) {
            // console.log(user)
            this.setCurrentUser(user); // Sets 'user' in localStorage
          }
        })
      )

    // return this.http.post<AppUserLoggedIn>
    //   (`${environment.apiUrl}/${this.accountControllerUrl}/Login`, loginForm)

    //Don't forget to set the currentUser$, along with its roles decoded from the token
  }

  setCurrentUser(user: AppUserLoggedIn) {
    user.roles = []
    const roles = this.getDecodedToken(user.token).role // Extract roles from token
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles) // Set found roles in user object
    localStorage.setItem('user', JSON.stringify(user)) // Store user object as a string in localStorage
    this.currentUserSource.next(user) // Reference the user object
  }
  getDecodedToken(token: any) {
    var base64Url = token.split('.')[1]
    var base64 = decodeURIComponent(atob(base64Url).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))

    return JSON.parse(base64)
  }

  logout(): boolean {
    console.log(`${(localStorage.getItem('user')) ? "Logout success!" : "Already logged out!"}`)
    // Check if user is already logged out
    if (localStorage.getItem('user') == null) {
      return false
    } else {
      localStorage.removeItem('user')
      this.currentUserSource.next(null) // Clear current logged in user
      return true
    }
  }

}
