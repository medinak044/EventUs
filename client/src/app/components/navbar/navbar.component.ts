import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { AppUserService } from 'src/app/services/app-user.service';
import { PreviousRouteService } from 'src/app/services/previous-route.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  previousUrl!: string

  constructor(
    public appUserService: AppUserService,
    private router: Router,
    private previousRouteService: PreviousRouteService,
  ) { }

  ngOnInit(): void {
    this.previousUrl = this.previousRouteService.getPreviousUrl()!
  }

  logout() {
    this.appUserService.logout('/')
  }

  // // Testing to see if token interceptor was able to configure headers with the token
  // testAuthEndpoint() {
  //   this.appUserService.getUserProfile().subscribe({
  //     next: (res: any) => console.log(res),
  //     error: err => console.log(err)
  //   })
  // }
}
