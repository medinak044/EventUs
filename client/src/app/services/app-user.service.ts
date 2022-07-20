import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { AppUserRegister } from '../models/appUserRegister';
import { AppUserEdit } from '../models/appUserEdit';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private controllerUrl = "Account" // AccountController

  constructor(private http: HttpClient) { }

  public getUserById(userId: string): Observable<AppUser> {
    return this.http.get<AppUser>(`${environment.apiUrl}/${this.controllerUrl}/GetUserById/${userId}`)
  }

  public getAppUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetAllUsers`)
  }

  public updateAppUser(appUser: AppUser): Observable<AppUser> {
    return this.http.post<AppUser>
      (`${environment.apiUrl}/${this.controllerUrl}/UpdateUser`, appUser)
  }

  public createAppUser(appUserRegister: AppUserRegister): Observable<AppUserRegister[]> {
    return this.http.post<AppUserRegister[]>
      (`${environment.apiUrl}/${this.controllerUrl}/Register`, appUserRegister)
  }

  // public deleteAppUser(appUser: AppUser): Observable<AppUser[]> {
  //   return this.http.delete<AppUser[]>
  //     (`${environment.apiUrl}/${this.controllerUrl}/DeleteUser/${appUser.id}`)
  // }
  public deleteAppUser(userId: string) {
    return this.http.delete(`${environment.apiUrl}/${this.controllerUrl}/DeleteUser/${userId}`)
  }
}
