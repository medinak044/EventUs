import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AccountRole } from '../models/accountRole';
import { AccountRoleDto } from '../models/accountRoleDto';
import { AppUserAdminDto } from '../models/appUserAdminDto';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private controllerUrl: string = "AccountRole" // AccountRoleController


  constructor(private http: HttpClient) { }

  getAllUsers_Admin(): Observable<AppUserAdminDto[]> {
    return this.http.get<AppUserAdminDto[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetAllUsers`)
  }

  getAllAvailableRoles(): Observable<AccountRole[]> {
    return this.http.get<AccountRole[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetAllAvailableRoles`)
  }

  getUserRoles(email: string): Observable<AccountRole[]> {
    return this.http.get<AccountRole[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetUserRoles/${email}`)
  }

  addUserToRole(accountRoleDto: AccountRoleDto) {
    return this.http.post
      (`${environment.apiUrl}/${this.controllerUrl}/AddUserToRole`, accountRoleDto)
  }

  removeUserFromRole(accountRoleDto: AccountRoleDto) {
    return this.http.post
      (`${environment.apiUrl}/${this.controllerUrl}/RemoveUserFromRole`, accountRoleDto)
  }
}
