import { Component, Input, OnInit } from '@angular/core';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  // Receive the id of the user
  @Input() userId?: string
  user?: AppUser

  constructor(private appUserService: AppUserService) { }

  ngOnInit(): void {
    this.getUserData("") // Provide profile page with user data
  }

  getUserData(userId: string) {
    // this.appUserService.getUserById
  }

  // Demonstration of clicking to go to profile https://youtu.be/xCkybV9mtk8?t=4266
}
