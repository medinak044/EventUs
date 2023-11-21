import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppUser } from 'src/app/models/appUser';
import { UserConnectionResponseDto } from 'src/app/models/userConnectionResponseDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserConnectionService } from 'src/app/services/user-connection.service';
import {AppUserAdminDto} from "../../models/appUserAdminDto";

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  appUsers: AppUser[] = []
  appUsersFiltered: AppUser[] = []
  _filterText: string = ""
  userAmount?: Number
  defaultImg?: string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

  loggedInUser!: AppUser
  alreadyAddedUsers_Id?: string[] // Get all the logged in user's added users' ids

  get filterText(): string {
    return this._filterText
  }
  set filterText(value:string) {
    this._filterText = value
    this.appUsersFiltered = this.filterUserByUsername(value)
  }

  constructor(
    public appUserService: AppUserService,
    public userConnectionService: UserConnectionService
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.appUserService.getLocalStorageUser() // Get the logged in user
    this.getAllUsers() // Get user data on page load
    this.userConnectionService.getAddedUsers(this.appUserService.getLocalStorageUser().id).subscribe({
      next: (res: UserConnectionResponseDto[]) => {
        this.alreadyAddedUsers_Id = res.map(u => u.id) // Get an array of userIds
      },
      error: (err) => console.log(err)
    })
  }

  // Logic for html template
  html_IsAlreadyAdded(userId: string): any {
    const result = this.alreadyAddedUsers_Id?.find(uId => uId == userId)
    return result // Return a truthy or falsy value
  }

  getAllUsers() {
    this.appUserService.getAllUsers().subscribe({
      next: (appUsers: any) => {
        this.appUsers = appUsers.filter((u: any) => u.id != this.loggedInUser.id) // Get array of users, excluding logged in user from the results
        this.userAmount = this.appUsers.length
        this.appUsersFiltered = this.appUsers // Set the same values as well
      },
      error: err => console.log(err)
    })
  }

  // Saving users to account for inviting to event
  addUser(savedUserId: string) {
    this.alreadyAddedUsers_Id?.push(savedUserId) // Add user id to update display
    this.userConnectionService.createUserConnection(savedUserId).subscribe({
      next: (res) => {
        // console.log(res)
      },
      error: (err) => console.log(err)
    })
  }

  filterUserByUsername(filterTerm: string){
    if (this.appUsers.length === 0 || this.filterText === "") {
      return this.appUsers
    } else {
      // Return a filtered array
      return this.appUsers.filter((appUser) => {
        // Check if input text matches or partially matches
        return appUser.userName.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }
  // Pagination, switching through groups of paginated results (<< 1,2,3 >>)

}
