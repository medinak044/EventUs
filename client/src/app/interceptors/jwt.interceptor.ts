import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { AppUserService } from '../services/app-user.service';
import { AppUserLoggedIn } from '../models/appUserLoggedIn';

@Injectable() // Implemented in "app-routing.module.ts"
// Attaches authentification info (token) to http requests to access secured routes of the api
export class JwtInterceptor implements HttpInterceptor {

    constructor(private appUserService: AppUserService) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        let currentUser!: AppUserLoggedIn;

        this.appUserService.currentUser$.pipe(take(1)).subscribe(user => currentUser = user);
        if (currentUser) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            })
        }

        return next.handle(request);
    }
}
