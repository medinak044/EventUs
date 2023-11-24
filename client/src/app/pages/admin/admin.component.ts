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
  appUsersFiltered: AppUserAdminDto[] = []
  _filterText: string = ""
  currentUser: any
  allAvailableRoles: AccountRole[] = []

  get filterText(): string {
    return this._filterText
  }
  set filterText(value:string) {
    this._filterText = value
    this.appUsersFiltered = this.filterUserByUsername(value)
  }

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
        // Convert string C# DateTime to MM/dd/yyyy
        for (let i = 0; i < appUsers.length; i++) {
          // appUsers[i].dateCreated = new Date(Date.parse(appUsers[i].dateCreated))
          let aU = appUsers[i]
          let parsedDate = aU.dateAdded.split(/[-T]/) // "2023-11-20T20:49:23.0270753";
          aU.dateAddedStr = `${parsedDate[1]}/${parsedDate[2]}/${parsedDate[0]}` // MM/dd/yyyy
          // console.log(aU)
        }

        this.appUsers = [
          appUsers.find((u: AppUserAdminDto) => u.id == this.currentUser.id), // Shift currently logged in user to top of table
          ...appUsers.filter((u: AppUserAdminDto) => (u.id != this.currentUser.id)) // Omit currently logged in user at original index
        ]
        this.appUsersFiltered = this.appUsers // Set the same values as well
      },
      error: err => console.log(err)
    })
  }

  deleteUser(userId: string) {
    // if (this.currentUser.email != "admin@example.com")
    if (true) {
      this.appUsers = this.appUsers.filter(a => a.id !== userId)
      this.appUsersFiltered = this.appUsers

      this.appUserService.deleteUser(userId)
        .subscribe({
          next: () => { },
          error: (err) => { console.log(err) }
        })
    } else {
      console.error("Demo admin not allowed to edit user data")
    }
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
}
