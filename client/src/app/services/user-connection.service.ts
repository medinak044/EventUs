import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserConnectionResponseDto } from '../models/userConnectionResponseDto';

@Injectable({
  providedIn: 'root'
})
export class UserConnectionService {
  private controllerUrl: string = "UserConnection" // UserConnectionController


  constructor(
    private http: HttpClient,
  ) { }

  // Get all added users of the provided user
  getAddedUsers(userId: string): Observable<UserConnectionResponseDto[]> {
    return this.http.get<UserConnectionResponseDto[]>
      (`${environment.apiUrl}/${this.controllerUrl}/GetAddedUsers/${userId}`)
  }

  createUserConnection(savedUserId: string) {
    return this.http.get
      (`${environment.apiUrl}/${this.controllerUrl}/CreateUserConnection/${savedUserId}`)
  }

  removeUserConnection(userConnectionId: number) {
    return this.http.delete
      (`${environment.apiUrl}/${this.controllerUrl}/RemoveUserConnection/${userConnectionId}`)
  }

}
