import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, UntypedFormBuilder, FormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { AppUserRegister } from 'src/app/models/appUserRegister';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  previousUrl!: string
  registerForm: UntypedFormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    userName: ['', Validators.required],
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
    confirmPassword: ['', [Validators.required]]
  }, {
    validators: this.mustMatch('password', 'confirmPassword')
  })
  get f() { return this.registerForm.controls } // Getter method for displaying error messages
  validationErrors: string[] = []
  registerButtonIsPressed: boolean = false
  registerErrorMessage: string = ""

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private previousRouteService: PreviousRouteService,
  ) {
  }

  ngOnInit(): void {
    // If user is already logged in
    if (localStorage.getItem('user')) {
      console.log('register: User is already logged in, redirecting to home page')
      this.router.navigateByUrl('/home')
    }
    let today = new Date()
    console.log(today)

    this.previousUrl = this.previousRouteService.getPreviousUrl()!
  }

  mustMatch(password: any, confirmPassword: any) {
    return (formGroup: UntypedFormGroup) => {
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
    this.registerButtonIsPressed = true
    // Map registerForm to another model to be sent to api
    const { firstName, lastName, userName, email, password } = this.registerForm.value

    let newRegisterForm: AppUserRegister = new AppUserRegister()
    newRegisterForm.firstName = firstName
    newRegisterForm.lastName = lastName
    newRegisterForm.userName = userName
    newRegisterForm.email = email
    newRegisterForm.password = password
    // newRegisterForm.dateCreated = new Date() // Today's date

    this.appUserService.register(newRegisterForm).subscribe({
      next: (res: any) => { this.router.navigateByUrl(this.previousUrl) },
      error: (err: any) => {
        this.registerButtonIsPressed = false // Reset the loading visual if unable to connect to api
        this.registerErrorMessage = "Database is waking up, please submit again."
        this.validationErrors = err
      }
    })
  }
}
