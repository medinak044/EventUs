import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppUser } from 'src/app/models/appUser';
import { UserEvent } from 'src/app/models/userEvent';
import { UserConnectionResponseDto } from 'src/app/models/userConnectionResponseDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { UserConnectionService } from 'src/app/services/user-connection.service';
import { EventService } from 'src/app/services/event.service';
import { Observable } from 'rxjs';
import { Attendee } from 'src/app/models/attendee';
import { AttendeeRequestDto } from 'src/app/models/attendeeRequestDto';

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
  events$?: Observable<UserEvent[]>

  defaultImg?: string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"
  profileImgUrl?: string = this.defaultImg

  constructor(
    private appUserService: AppUserService,
    public eventService: EventService,
    public userConnectionService: UserConnectionService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.userIdParam = this.activatedRoute.snapshot.paramMap.get('userId') as string
    this.loggedInUser = this.appUserService.getLocalStorageUser() // Get currently logged in user data
    this.getUserData(this.userIdParam) // Provide profile page with user data
    this.getUserEvents()
    this.getAddedUsers()
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

  getUserEvents() {
    this.events$ = this.eventService.getUserEvents() // Refresh collection of Events

    this.eventService.getUserEvents().subscribe({
      next: (res: UserEvent[]) => {
        this.events = res
      },
      error: (err) => { console.log(err) }
    })
  }

  getAddedUsers() {
    this.userConnectionService.getAddedUsers(this.appUserService.getLocalStorageUser().id).subscribe({
      next: (res: UserConnectionResponseDto[]) => {
        this.alreadyAddedUsers = res // Get an array of users
      },
      error: (err) => console.log(err)
    })
  }

  // ---- (Start) Logged in user's own profile view ---- //
  inviteToEvent(appUserId: string, eventId: number) {
    let attendeeRequestDto = {
      id: 0,
      roleId: 1, // "Attendee" role by default
      appUserId: appUserId,
      eventId: eventId
    }

    this.eventService.createAttendee(attendeeRequestDto).subscribe({
      next: (res: any) => {

      },
      error: (err) => { console.log(err) }
    })
  }

  removeUser(userConnectionId: number, userToBeRemovedId: string) {
    this.alreadyAddedUsers = this.alreadyAddedUsers?.filter(u => u.userConnectionId != userConnectionId) // Update display of users

    this.userConnectionService.removeUserConnection(userConnectionId).subscribe({
      next: (res) => {

      },
      error: (err) => { console.log(err) }
    })

    // Also remove the user from all (the logged in user's) events
    this.eventService.getUserEvents().subscribe({
      next: (eventList: UserEvent[]) => {
        this.eventService.getAllAttendees().subscribe({
          next: (attendeeList: Attendee[]) => {
            attendeeList.forEach((a: Attendee) => {
              for (let i = 0; i < eventList.length; i++) {
                if (a.appUserId == userToBeRemovedId
                  && (a.eventId == eventList[i].id)) {
                  this.eventService.removeAttendee(a.id).subscribe({
                    next: (res: any) => {
                      console.log("Removed Attendee from eventId:", a.eventId)
                    },
                    error: (err) => { console.log(err) }
                  })
                }
              }
            })
          },
          error: (err) => { console.log(err) }
        })
      },
      error: (err) => { console.log(err) }
    })
  }

  // ---- (End) Logged in user's own profile view ---- //
}
