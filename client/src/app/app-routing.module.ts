import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ViewUsersComponent } from './pages/view-users/view-users.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'view-users', component: ViewUsersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
