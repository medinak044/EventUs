import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-edit-app-user',
  templateUrl: './edit-app-user.component.html',
  styleUrls: ['./edit-app-user.component.css']
})
export class EditAppUserComponent implements OnInit {
  @Input() appUser?: AppUser
  @Output() appUsersUpdated = new EventEmitter<AppUser[]>()

  constructor(private appUserService: AppUserService) { }

  ngOnInit(): void {
  }

  // Create
  public createAppUser(appUser: AppUser) {
    this.appUserService
      .updateAppUser(appUser)
      .subscribe({
        next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
        error: err => console.log(err)
      })
  }

  // Update
  public updateAppUser(appUser: AppUser) {
    this.appUserService
      .updateAppUser(appUser)
      .subscribe({
        next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
        error: err => console.log(err)
      })
  }

  // Delete
  public deleteAppUser(appUser: AppUser) {
    this.appUserService
      .deleteAppUser(appUser)
      .subscribe({
        next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
        error: err => console.log(err)
      })
  }
}
