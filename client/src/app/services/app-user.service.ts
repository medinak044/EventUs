import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private controllerUrl = "Account" // AccountController

  constructor(private http: HttpClient) { }

  public getAppUsers(): Observable<AppUser[]> {
    return this.http.get<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}`)
  }

  public updateAppUser(AppUser: AppUser): Observable<AppUser[]> {
    return this.http.put<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}`, AppUser)
  }

  public createAppUser(AppUser: AppUser): Observable<AppUser[]> {
    return this.http.post<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}`, AppUser)
  }

  public deleteAppUser(AppUser: AppUser): Observable<AppUser[]> {
    return this.http.delete<AppUser[]>
      (`${environment.apiUrl}/${this.controllerUrl}/${AppUser.email}`)
  }
}
