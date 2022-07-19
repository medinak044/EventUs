import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { AppUserRegister } from 'src/app/models/appUserRegister';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  appUsers: AppUser[] = []
  appUserToEdit?: AppUser
  appUserRegister?: AppUserRegister

  constructor(private appUserService: AppUserService) { }

  async ngOnInit(): Promise<void> {
    // Get user data on page load
    await this.appUserService
      .getAppUsers()
      .subscribe((res: AppUser[]) => {
        return this.appUsers = res
      })
  }

  updateAppUserList(appUsers: AppUser[]) {
    this.appUsers = appUsers
  }

  initNewAppUser() {
    // Launch register form (new page or modal)

    // this.appUserRegister = new AppUserRegister
  }

  editAppUser(appUser: AppUser) {
    this.appUserToEdit = appUser
  }
}
