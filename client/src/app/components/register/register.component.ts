import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { AppUserRegister } from 'src/app/models/appUserRegister';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup
  get f() { return this.registerForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []

  constructor(private appUserService: AppUserService, private fb: FormBuilder,
    private router: Router) {
  }

  ngOnInit(): void {
    this.initializeForm()
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.mustMatch('password', 'confirmPassword')
    })
  }

  mustMatch(password: any, confirmPassword: any) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.controls[password]
      const confirmPasswordControl = formGroup.controls[confirmPassword]

      if (confirmPasswordControl.errors && !confirmPasswordControl.errors['Mustmatch']) { return }

      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ MustMatch: true })
      } else {
        confirmPasswordControl.setErrors(null)
      }
    }
  }

  registerSubmit() {
    // Map registerForm to another model to be sent to api
    const { firstName, lastName, userName, email, password } = this.registerForm.value

    let model: AppUserRegister = new AppUserRegister()
    model.firstName = firstName
    model.lastName = lastName
    model.userName = userName
    model.email = email
    model.password = password

    this.appUserService.createAppUser(model).subscribe({
      next: (res: any) => console.log("Success! Navigated to user profile"), // Navigate to user profile
      error: (err: any) => this.validationErrors = err // Add errors
    })
  }


  // // Create/Register
  // public createAppUser(appUserRegister: AppUserRegister) {
  //   this.registerForm.value
  //   this.appUserService
  //     .createAppUser(appUserRegister.)
  //   // .subscribe({
  //   //   next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
  //   //   error: err => console.log(err)
  //   // })

  //   // Once user has been created, redirect to personal profile
  // }

  // // Update
  // public updateAppUser(appUser: AppUser) {
  //   this.appUserService
  //     .updateAppUser(appUser)
  //     .subscribe({
  //       next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
  //       error: err => console.log(err)
  //     })
  // }

  // // Delete
  // public deleteAppUser(appUser: AppUser) {
  //   this.appUserService
  //     .deleteAppUser(appUser)
  //     .subscribe({
  //       next: (appUsers: AppUser[]) => this.appUsersUpdated.emit(appUsers),
  //       error: err => console.log(err)
  //     })
  // }
}
