import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';
import { RegisterComponent } from './components/register/register.component';
import { SignUpComponent } from './pages/sign-up/sign-up.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { EditUserModalComponent } from './components/edit-user-modal/edit-user-modal.component';
import { EditUserComponent } from './pages/edit-user/edit-user.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { AdminComponent } from './pages/admin/admin.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventCardComponent } from './pages/event-page/event-card/event-card.component';
import { EventFormComponent } from './pages/event-page/event-form/event-form.component';
import { EventViewComponent } from './pages/event-page/event-view/event-view.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    FooterComponent,
    ViewUsersComponent,
    RegisterComponent,
    SignUpComponent,
    LoginPageComponent,
    ProfileComponent,
    EditUserModalComponent,
    EditUserComponent,
    PageNotFoundComponent,
    HasRoleDirective,
    AdminComponent,
    EventPageComponent,
    EventCardComponent,
    EventFormComponent,
    EventViewComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Allows this client app to perform HTTP requests
    FormsModule, // ngModel
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
