import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppUserService } from '../services/app-user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private appUserService: AppUserService,
    private router: Router
  ) { }

  // If user is not authenticated, block private routes
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    // Check if user is logged in
    if (localStorage.getItem('user') != null) {
      return true
    } else {
      console.log('User must be logged in!')
      this.router.navigateByUrl('/login') // Redirect user to login page
      return false
    }
  }

}
