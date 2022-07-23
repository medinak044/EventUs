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

  login(loginForm: AppUserLogin): Observable<AppUserLoggedIn> {
    // return this.http.post
    //   (`${environment.apiUrl}/${this.accountControllerUrl}/Login`, loginForm)
    //   .pipe(
    //     map((response: any) => {
    //       const user = response;
    //       if (user) {
    //         //(set 'user' in localStorage here instead of login-page-component)
    //         console.log(user)
    //         this.setCurrentUser(user);
    //       }
    //     })
    //   )

    return this.http.post<AppUserLoggedIn>
      (`${environment.apiUrl}/${this.accountControllerUrl}/Login`, loginForm)
  }

  setCurrentUser(user: AppUserLoggedIn) {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role; // Extract roles from token
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles); // Set found roles in user object
    localStorage.setItem('user', JSON.stringify(user)); // Persist the login via localStorage
    this.currentUserSource.next(user);
  }
  getDecodedToken(token: any) {
    return JSON.parse(atob(token.split('.'[1])))
  }


  logout() {
    console.log("Logout success!")
    localStorage.removeItem('user');
    // localStorage.removeItem('token')
    // localStorage.removeItem('refreshToken')
    this.currentUserSource.next(null); // Clear current logged in user
  }

}
