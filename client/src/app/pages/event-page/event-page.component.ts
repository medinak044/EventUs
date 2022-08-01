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
    events?: UserEvent[] // Collection of Events of the logged in user
    events$?: Observable<UserEvent[]>
    currentEvent?: any // When this is populated with Event data, open the component

    isCreatingNewEvent: boolean = false // Switch display over to event form

    constructor(
        public appUserService: AppUserService,
        public eventService: EventService,
    ) { }

    ngOnInit(): void {
        // Get list of events that user owns or is an attendee of(invited)
        this.loggedInUser = this.appUserService.getLocalStorageUser()
        this.getUserEvents() // Get all logged in user's events
    }

    getUserEvents() {
        this.events$ = this.eventService.getUserEvents() // Refresh collection of Events

        // let tempEvents: UserEvent[]

        // this.eventService.getUserEvents().subscribe({
        //     next: (res: UserEvent[]) => {
        //         res.forEach((e: UserEvent) => {
        //             this.appUserService.getUserById(e.ownerId).subscribe({
        //                 next: (res: AppUser) => {
        //                     e.owner = res
        //                     tempEvents.push(e) // Get the owner data for each event, then add event to list
        //                     // this.events?.push(e) // Get the owner data for each event, then add event to list
        //                     console.log(e)
        //                 },
        //                 error: (err) => { console.log(err) }
        //             })
        //         })
        //     },
        //     error: (err) => { console.log(err) }
        // })
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
}
