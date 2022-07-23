import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  previousUrl!: string
  userIdParam!: string
  appUser!: AppUser
  editForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
  }) // This assignment suppresses the formGroup console error

  get f() { return this.editForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []


  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private previousRouteService: PreviousRouteService
  ) { }

  ngOnInit(): void {
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string
    this.previousUrl = this.previousRouteService.getPreviousUrl()!
    this.getUserData()
  }

  getUserData() {
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

  editSubmit() {
    // Map registerForm to another model to be sent to api
    const { firstName, lastName, userName, email } = this.editForm.value

    let updatedUser: AppUser = new AppUser()
    updatedUser.id = this.userIdParam
    updatedUser.firstName = firstName
    updatedUser.lastName = lastName
    updatedUser.userName = userName
    updatedUser.email = email

    this.appUserService.updateUser(updatedUser).subscribe({
      next: (res: any) => {
        // Navigate back to previous route
        this.router.navigateByUrl(this.previousUrl)
      },
      error: (err: any) => this.validationErrors = err // Add errors
    })
  }

}
