import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
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
  registerForm: FormGroup = this.fb.group({
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

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private fb: FormBuilder,
    private previousRouteService: PreviousRouteService,
  ) {
  }

  ngOnInit(): void {
    // If user is already logged in 
    if (localStorage.getItem('user')) {
      console.log('register: User is already logged in, redirecting to home page')
      this.router.navigateByUrl('/home')
    }

    this.previousUrl = this.previousRouteService.getPreviousUrl()!
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

    let newRegisterForm: AppUserRegister = new AppUserRegister()
    newRegisterForm.firstName = firstName
    newRegisterForm.lastName = lastName
    newRegisterForm.userName = userName
    newRegisterForm.email = email
    newRegisterForm.password = password

    this.appUserService.register(newRegisterForm).subscribe({
      next: (res: any) => { this.router.navigateByUrl(this.previousUrl) }, // (Won't redirect unless provided the correct Observable data type)
      error: (err: any) => this.validationErrors = err // Add errors
    })
  }
}
