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
    // First, check if user is logged in
    if (localStorage.getItem('user')) {
      if (this.appUserService.logout() === true) {
        // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        //   this.router.navigateByUrl('/') // Quickly navigates to the first url, then to the second
        // })
      }
    }
  }

  // // Testing to see if token interceptor was able to configure headers with the token
  // testAuthEndpoint() {
  //   this.appUserService.getUserProfile().subscribe({
  //     next: (res: any) => console.log(res),
  //     error: err => console.log(err)
  //   })
  // }
}
