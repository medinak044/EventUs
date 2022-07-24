import { Component, OnInit } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  appUsers: AppUser[] = []
  userAmount?: Number

  constructor(
    public appUserService: AppUserService
  ) { }

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

  deleteUser(userId: string) {
    // Makeshift way (without using .subscribe()) to update UI due to some httperror after deleting
    this.appUsers = this.appUsers.filter(a => a.id !== userId)
    this.userAmount = this.appUsers.length

    this.appUserService.deleteUser(userId)
      .subscribe({
        next: () => { },
        error: (err) => { console.log(err) }
      })
  }

  // Role CRUD
}
