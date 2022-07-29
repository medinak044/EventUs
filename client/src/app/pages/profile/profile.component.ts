import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { UserEvent } from 'src/app/models/userEvent';
import { UserConnectionResponseDto } from 'src/app/models/userConnectionResponseDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserConnectionService } from 'src/app/services/user-connection.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  userIdParam!: string
  profileUser!: AppUser

  loggedInUser!: AppUser
  alreadyAddedUsers?: UserConnectionResponseDto[] // Get all the logged in user's added users
  events?: UserEvent[]

  defaultImg?: string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  profileImgUrl?: string = this.defaultImg

  constructor(
    private appUserService: AppUserService,
    public userConnectionService: UserConnectionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string
    this.loggedInUser = this.appUserService.getLocalStorageUser() // Get currently logged in user data
    this.getUserData(this.userIdParam) // Provide profile page with user data

    this.userConnectionService.getAddedUsers(this.appUserService.getLocalStorageUser().id).subscribe({
      next: (res: UserConnectionResponseDto[]) => {
        // this.alreadyAddedUsers = res.map(u => u.id) // Get an array of userIds
        this.alreadyAddedUsers = res // Get an array of users
      },
      error: (err) => console.log(err)
    })

  }

  html_IsAlreadyAdded(userId: string): any {
    const result = this.alreadyAddedUsers?.find(user => user.id == userId)
    return result // Return a truthy or falsy value
  }

  getUserData(userId: string) {
    this.appUserService.getUserById(userId).subscribe({
      next: (appUser: AppUser) => { this.profileUser = appUser },
      error: (err) => console.log(err)
    })
  }

  getAllConnections() {
    // Gets all Connection objects (relevant to either loggedInUser or the profileUser)
  }

  sendConnectionRequest(userId: string) {
    // send http request
    // Update connections dashboard to display connection request by user: xxxx
  }


  // ---- (Start) Logged in user's own profile view ---- //
  inviteToEvent() {

  }

  removeUser(userConnectionId: number) {
    this.alreadyAddedUsers = this.alreadyAddedUsers?.filter(u => u.userConnectionId != userConnectionId) // Update display of users

    this.userConnectionService.removeUserConnection(userConnectionId).subscribe({
      next: (res) => {

      },
      error: (err) => { console.log(err) }
    })
  }

  // ---- (End) Logged in user's own profile view ---- //

  // acceptRequest() {

  // }

  // declineRequest() {

  // }

  // Demonstration of clicking to go to profile https://youtu.be/xCkybV9mtk8?t=4266

  //dont forget Edit user button (html)
}
