import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { AppUserEdit } from 'src/app/models/appUserEdit';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  // previousUrl!: string
  userIdParam!: string
  appUser!: AppUser
  editForm!: FormGroup
  get f() { return this.editForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []


  constructor(private appUserService: AppUserService, private activatedRoute: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string
    this.getUserData()
  }

  async getUserData() {
    this.appUserService.getUserById(this.userIdParam).subscribe({
      next: (appUser: any) => {
        this.appUser = appUser
        this.initializeForm(appUser)
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

  // editSubmit() {
  //   // Redirect back to previous page
  //   //^ Find out how to store previous route url
  // }

  editSubmit() {
    // Map registerForm to another model to be sent to api
    const { firstName, lastName, userName, email } = this.editForm.value

    let updatedUser: AppUser = new AppUser()
    updatedUser.id = this.userIdParam
    updatedUser.firstName = firstName
    updatedUser.lastName = lastName
    updatedUser.userName = userName
    updatedUser.email = email

    console.log(updatedUser)

    this.appUserService.updateAppUser(updatedUser).subscribe({
      next: (res: any) => console.log("Success! Navigated to user profile"), // Navigate to user profile
      error: (err: any) => this.validationErrors = err // Add errors
    })
  }
}
