import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { Observable, ReplaySubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AppUserRegister } from '../models/appUserRegister';
import { AppUserLogin } from '../models/appUserLogin';
import { AuthResult } from '../models/authResult';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private accountControllerUrl: string = "Account" // AccountController
  // private currentUserSource = new ReplaySubject<AppUser>(1);
  // currentUser$ = this.currentUserSource.asObservable();

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


  // See Neil Cummings async pipe https://www.udemy.com/course/build-an-app-with-aspnet-core-and-angular-from-scratch/learn/lecture/22400670#questions

  login(loginForm: AppUserLogin): Observable<AuthResult> {
    return this.http.post<AuthResult>
      (`${environment.apiUrl}/${this.accountControllerUrl}/Login`, loginForm)
  }

  // setCurrentUser(user: AppUser) {

  // }

  // logout() {


  // }

  // getDecodedToken(token: any) {
  //   // Logic for retrieving a decoded token (see Neil Cummings for details)
  //   return JSON.parse(atob(token.split('.'[1])))
  // }
}
