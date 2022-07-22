import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AppUserLogin } from 'src/app/models/appUserLogin';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  previousUrl!: string
  loginForm: FormGroup = this.fb.group({
    email: ['', Validators.pattern('[a-z0-9]+@[a-z]+\.[a-z]{2,3}')],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(50)]],
  })
  get f() { return this.loginForm.controls } // Getter method for displaying error messages

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private fb: FormBuilder,
    private previousRouteService: PreviousRouteService,
  ) { }

  ngOnInit(): void {
    this.previousUrl = this.previousRouteService.getPreviousUrl()!.toString()
    console.log(`${localStorage.getItem('token') ? (`Existing token: ${localStorage.getItem('token')}`) : 'No token in localStorage'}`)
  }

  loginSubmit() {
    const { email, password } = this.loginForm.value

    let newLoginForm: AppUserLogin = new AppUserLogin()
    newLoginForm.email = email
    newLoginForm.password = password

    this.appUserService.login(newLoginForm)
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('token', res.token)
          this.router.navigateByUrl(this.previousUrl)
        },
        error: (err: any) => { console.log(err) }
      })
  }
}
