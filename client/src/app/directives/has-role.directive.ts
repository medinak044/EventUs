import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { take } from 'rxjs/operators';
import { AppUserLoggedIn } from '../models/appUserLoggedIn';
import { AppUserService } from '../services/app-user.service';


@Directive({
    selector: '[appHasRole]'
})
export class HasRoleDirective implements OnInit {
    @Input() appHasRole: string[] = []
    user!: AppUserLoggedIn

    constructor(
        private viewContainerRef: ViewContainerRef,
        private templateRef: TemplateRef<any>,
        private appUserService: AppUserService
    ) {
        // Reference currentUser$
        this.appUserService.currentUser$.pipe(take(1)).subscribe(user => {
            this.user = user;
        })
    }

    ngOnInit(): void {
        // Clear view if no roles
        if (!this.user?.roles || this.user == null) {
            this.viewContainerRef.clear()
            return
        }

        if (this.user?.roles.some(r => this.appHasRole.includes(r))) {
            this.viewContainerRef.createEmbeddedView(this.templateRef)
        } else {
            this.viewContainerRef.clear()
        }
    }
}
