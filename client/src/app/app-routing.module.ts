import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { AdminComponent } from './pages/admin/admin.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';
import { AdminGuard } from './guards/admin.guard';
import { EventPageComponent } from './pages/event-page/event-page.component';

const routes: Routes = [
  // Default redirect to home page
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // Non-public paths
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    children: [
      { path: 'view-users', component: ViewUsersComponent },
      { path: 'events', component: EventPageComponent },
      // { path: 'events/:userId', component: EventPageComponent },
      { path: 'profile/:userId', component: ProfileComponent },
      { path: 'edit-user/:userId', component: EditUserComponent },
      { path: 'admin', component: AdminComponent, canActivate: [AdminGuard] },
    ]
  },
  // Public paths
  { path: 'home', component: HomeComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginPageComponent },
  { path: '**', component: PageNotFoundComponent }, // Wildcard route
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ]
})
export class AppRoutingModule { }
