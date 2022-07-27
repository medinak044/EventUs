import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppUser } from 'src/app/models/appUser';
import { UserConnectionResponseDto } from 'src/app/models/userConnectionResponseDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserConnectionService } from 'src/app/services/user-connection.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  appUsers: AppUser[] = []
  userAmount?: Number

  loggedInUser!: AppUser
  alreadyAddedUsers?: string[] // Get all the logged in user's added users' ids

  constructor(
    public appUserService: AppUserService,
    public userConnectionService: UserConnectionService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.appUserService.getLocalStorageUser() // Get the logged in user
    this.getAllUsers() // Get user data on page load
    this.userConnectionService.getAddedUsers(this.appUserService.getLocalStorageUser().id).subscribe({
      next: (res: UserConnectionResponseDto[]) => {
        this.alreadyAddedUsers = res.map(u => u.id) // Get an array of userIds
      },
      error: (err) => console.log(err)
    })
  }

  // Logic for html template
  html_IsAlreadyAdded(userId: string): any {
    const result = this.alreadyAddedUsers?.find(uId => uId == userId)
    return result // Return a truthy or falsy value
  }

  getAllUsers() {
    this.appUserService.getAllUsers().subscribe({
      next: (appUsers: any) => {
        this.appUsers = appUsers.filter((u: any) => u.id != this.loggedInUser.id) // Get array of users, excluding logged in user from the results
        this.userAmount = this.appUsers.length
      },
      error: err => console.log(err)
    })
  }

  // Saving users to account for inviting to event
  addUser(savedUserId: string) {
    this.alreadyAddedUsers?.push(savedUserId) // Add user id to update display
    this.userConnectionService.createUserConnection(savedUserId).subscribe({
      next: (res) => {
        // console.log(res)
      },
      error: (err) => console.log(err)
    })
  }

  // Pagination, switching through groups of paginated results (<< 1,2,3 >>)

}
