import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userIdParam!: string
  appUser?: AppUser

  constructor(
    private appUserService: AppUserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string

    this.getUserData(this.userIdParam) // Provide profile page with user data
  }

  getUserData(userId: string) {
    this.appUserService.getUserById(userId).subscribe({
      next: (appUser: AppUser) => { this.appUser = appUser },
      error: (err) => console.log(err)
    })
  }



  // Demonstration of clicking to go to profile https://youtu.be/xCkybV9mtk8?t=4266

  //dont forget Edit user button (html)
}
