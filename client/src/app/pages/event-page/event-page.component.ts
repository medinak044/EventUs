import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AppUser } from 'src/app/models/appUser';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { Attendee } from 'src/app/models/attendee';
import { CheckListItem } from 'src/app/models/checkListItem';
import { UserEvent } from 'src/app/models/userEvent';
import { AppUserService } from 'src/app/services/app-user.service';
import { EventService } from 'src/app/services/event.service';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
    loggedInUser!: AppUserLoggedIn
    events: UserEvent[] = [] // Collection of Events of the logged in user
    events$?: Observable<UserEvent[]>
    currentEvent?: any // When this is populated with Event data, open the component

    eventsFiltered: UserEvent[] = []
    _filterText: string = ""
    isCreatingNewEvent: boolean = false // Switch display over to event form

  get filterText(): string {
    return this._filterText
  }
  set filterText(value:string) {
    this._filterText = value
    this.eventsFiltered = this.filterEventByTitle(value)
  }

    constructor(
        public appUserService: AppUserService,
        public eventService: EventService,
    ) { }

    ngOnInit(): void {
        // Get list of events that user owns or is an attendee of(invited)
        this.loggedInUser = this.appUserService.getLocalStorageUser()
        this.getUserEvents() // Get all logged in user's events
    }

    // Refresh collection of Events
    getUserEvents() {
        this.events$ = this.eventService.getUserEvents() // Gets events relavent to the logged in user
      // Get non-observable values, associated with the logged-in user
      this.eventService.getUserEvents().subscribe(
        (res:UserEvent[]) => {
          this.events = res
          this.eventsFiltered = res // Set the same values as well
        }
      )
    }

    switchFormState(isFormActive: boolean) {
        this.isCreatingNewEvent = isFormActive
    }

    setCurrentEvent(eventDetails: UserEvent) {
        this.currentEvent = eventDetails // Set the current event based on emitted event id from child component
    }

    // Can be used to switch events, or go back to event dashboard
    updateCurrentEvent(eventDetails: UserEvent) {
        this.currentEvent = eventDetails
    }

    removeEvent(eventId: number) {
        if (eventId > 0) {
            this.eventService.removeEvent(eventId).subscribe({
                next: (res: any) => {
                    this.getUserEvents() // Update visual display
                },
                error: (err) => { console.log(err) }
            })
        }
    }

  filterEventByTitle(filterTerm: string){
    if (this.events.length === 0 || this.filterText === "") {
      return this.events
    } else {
      // Return a filtered array
      return this.events.filter((event) => {
        // Check if input text matches or partially matches
        return event.title.toLowerCase().startsWith(filterTerm.toLowerCase())
      })
    }
  }
}
