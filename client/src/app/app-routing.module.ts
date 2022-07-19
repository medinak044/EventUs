import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'view-users', component: ViewUsersComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'profile', component: ProfileComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
