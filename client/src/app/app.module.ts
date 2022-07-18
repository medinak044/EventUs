import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EditAppUserComponent } from './components/edit-app-user/edit-app-user.component';


@NgModule({
  declarations: [
    AppComponent,
    EditAppUserComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule, // Allows this client app to perform HTTP requests
    FormsModule // ngModel
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
