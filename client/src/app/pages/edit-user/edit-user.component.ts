import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountRole } from 'src/app/models/accountRole';
import { AccountRoleDto } from 'src/app/models/accountRoleDto';
import { AppUser } from 'src/app/models/appUser';
import { AdminService } from 'src/app/services/admin.service';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';
import {AppUserUpdateDto} from "../../models/appUserUpdateDto";

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  previousUrl!: string
  userIdParam!: string
  appUserToBeEdited!: AppUser
  appUserToBeEdited_Roles: AccountRole[] = [] // From currently displayed user
  editForm: UntypedFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
  }) // This assignment suppresses the formGroup console error
  get f() { return this.editForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []

  currentUser: any
  allAssignableRoles: AccountRole[] = [] // All roles that can be assigned to user

  constructor(
    public appUserService: AppUserService,
    public adminService: AdminService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: UntypedFormBuilder,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit(): void {
    this.previousUrl = this.previousRouteService.getPreviousUrl()!
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string // Get user Id from url params
    this.currentUser = this.appUserService.getLocalStorageUser() // Get the user currently logged in
    this.getUserData() // Get the user being edited
    this.getAllAvailableRoles() // Get all possible account roles from api
  }

  getUserData() {
    this.appUserService.getUserById(this.userIdParam).subscribe({
      next: (appUser: any) => {
        this.appUserToBeEdited = appUser
        this.initializeForm(appUser)
        this.getUserRoles(appUser.email) // Get the roles of the user being edited
      },
      error: (err) => console.log(err)
    })
  }

  initializeForm(appUser: AppUser) {
    const { firstName, lastName, userName, email } = appUser

    this.editForm = this.fb.group({
      firstName: [firstName, Validators.required],
      lastName: [lastName, Validators.required],
      userName: [userName, Validators.required],
      email: [email, Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
    })
  }

  editSubmit() {
    // if (this.currentUser.email != "admin@example.com") {
    if (true) {
      // Map registerForm to another model to be sent to api
      const { firstName, lastName, userName, email } = this.editForm.value

      let updatedUser: AppUserUpdateDto = new AppUserUpdateDto()
      updatedUser.id = this.userIdParam
      updatedUser.firstName = firstName
      updatedUser.lastName = lastName
      updatedUser.userName = userName
      updatedUser.email = email

      console.log(updatedUser)

      this.appUserService.updateUser(updatedUser).subscribe({
        next: (res: any) => {
          // Navigate back to previous route
          this.router.navigateByUrl(this.previousUrl)
        },
        error: (err: any) => this.validationErrors = err // Add errors
      })
    } else {
      console.error("Demo admin not allowed to edit user data")
    }
  }

  // ---- Role CRUD (beginning) ---- //

  getAllAvailableRoles() {
    this.adminService.getAllAvailableRoles().subscribe({
      next: (res) => {
        this.allAssignableRoles = res
      },
      error: (err) => { console.log(err) }
    })
  }

  getUserRoles(email: string) {
    this.adminService.getUserRoles(email).subscribe({
      next: (res) => {
        this.appUserToBeEdited_Roles = res
      },
      error: (err) => { console.log(err) }
    })
  }

  addUserToRole(roleName: string) {
    // Check if user already has the role
    if (this.appUserToBeEdited_Roles.find(r => roleName == r.name)) {
      console.log(`This user already has the role: ${roleName}`)
      return
    }

    let accountRoleDto = new AccountRoleDto()
    accountRoleDto.email = this.appUserToBeEdited.email
    accountRoleDto.roleName = roleName

    this.adminService.addUserToRole(accountRoleDto).subscribe({
      next: (res) => {
        this.getUserRoles(this.appUserToBeEdited.email) // Update displayed roles
      },
      error: (err) => { console.log(err) }
    })
  }

  revokeRole(roleName: string) {
    let accountRoleDto = new AccountRoleDto()
    accountRoleDto.email = this.appUserToBeEdited.email
    accountRoleDto.roleName = roleName

    this.adminService.removeUserFromRole(accountRoleDto).subscribe({
      next: (res) => {
        this.getUserRoles(this.appUserToBeEdited.email) // Update displayed roles
      },
      error: (err) => { console.log(err) }
    })
  }
  // ---- Role CRUD (end) ---- //

}
