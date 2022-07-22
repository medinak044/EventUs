import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-view-users',
  templateUrl: './view-users.component.html',
  styleUrls: ['./view-users.component.css']
})
export class ViewUsersComponent implements OnInit {
  appUsers: AppUser[] = []
  appUserToEdit?: AppUser
  userAmount?: Number

  constructor(private appUserService: AppUserService) { }

  ngOnInit(): void {
    this.getAllUsers() // Get user data on page load
  }

  getAllUsers() {
    this.appUserService.getAllUsers().subscribe({
      next: (appUsers: any) => {
        this.appUsers = appUsers;
        this.userAmount = this.appUsers.length
      },
      error: err => console.log(err)
    })
  }

  // See edit button launching modal demo: https://youtu.be/SS7qIPE2LsE?t=2764
  initUserEdit(appUser: AppUser) {
    // this.appUserToEdit = appUser // In case editing modal form is used
    // Launch edit modal form
  }

  // See this to populate edit form on click https://youtu.be/eCbaZixsP-s?t=4883
  applyUserEdit(appUser: AppUser) {
    this.appUserToEdit = appUser

    // don't forget to clear the edit information
    // this.appUserToEdit = new AppUser()

    // Target the old appUser in appUsers(using id), then replace the values
    // ^Use the .map method to apply changes and create a new array
  }


  deleteUser(userId: string) {
    // Makeshift way (without using .subscribe()) to update UI due to some httperror after deleting
    this.appUsers = this.appUsers.filter(a => a.id !== userId)
    this.userAmount = this.appUsers.length

    this.appUserService.deleteUser(userId)
      .subscribe({
        next: () => {
          // this.appUsers = this.appUsers.filter(a => a.id !== userId)
          console.log("Working")
        },
        error: (err) => { console.log(err) }
      })
  }
}
