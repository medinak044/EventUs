import { Component, OnInit } from '@angular/core';
import { AccountRole } from 'src/app/models/accountRole';
import { AccountRoleDto } from 'src/app/models/accountRoleDto';
import { AppUser } from 'src/app/models/appUser';
import { AppUserAdminDto } from 'src/app/models/appUserAdminDto';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { AdminService } from 'src/app/services/admin.service';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  html_FalsyValue: string = "NULL" // For html template only

  appUsers: AppUserAdminDto[] = []
  currentUser: any
  allAvailableRoles: AccountRole[] = []

  constructor(
    public appUserService: AppUserService,
    public adminService: AdminService,
  ) { }

  ngOnInit(): void {
    this.currentUser = this.appUserService.getLocalStorageUser()
    this.getAllAvailableRoles() // Get all account user roles
    this.getAllUsers_Admin() // Get user data on page load
  }

  getAllUsers_Admin() {
    this.adminService.getAllUsers_Admin().subscribe({
      next: (appUsers: any) => {
        this.appUsers = [
          appUsers.find((u: AppUserAdminDto) => u.id == this.currentUser.id), // Shift currently logged in user to top of table
          ...appUsers.filter((u: AppUserAdminDto) => (u.id != this.currentUser.id)) // Omit currently logged in user at original index
        ]
      },
      error: err => console.log(err)
    })
  }
  // getAllUsers() {
  //   this.appUserService.getAllUsers().subscribe({
  //     next: (appUsers: any) => {
  //       console.log(appUsers[0].roles)
  //       this.appUsers = [
  //         appUsers.find((u: AppUserAdminDto) => u.id == this.currentUser.id), // Shift currently logged in user to top of table
  //         ...appUsers.filter((u: AppUserAdminDto) => (u.id != this.currentUser.id)) // Omit currently logged in user at original index
  //       ]
  //       // this.userAmount = this.appUsers.length
  //     },
  //     error: err => console.log(err)
  //   })
  // }

  deleteUser(userId: string) {
    // Makeshift way (without using .subscribe()) to update UI due to some httperror after deleting
    this.appUsers = this.appUsers.filter(a => a.id !== userId)

    this.appUserService.deleteUser(userId)
      .subscribe({
        next: () => { },
        error: (err) => { console.log(err) }
      })
  }

  // ---- Role CRUD (beginning) ---- //

  getAllAvailableRoles() {
    this.adminService.getAllAvailableRoles().subscribe({
      next: (res) => { this.allAvailableRoles = res },
      error: (err) => { console.log(err) }
    })
  }

  getUserRoles(email: string) {
    this.adminService.getUserRoles(email).subscribe({
      next: (res) => { },
      error: (err) => { console.log(err) }
    })
  }

  // ---- Role CRUD (end) ---- //
}
