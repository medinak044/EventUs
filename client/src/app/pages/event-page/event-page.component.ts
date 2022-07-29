import { Component, OnInit } from '@angular/core';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { UserEvent } from 'src/app/models/userEvent';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
    loggedInUser!: AppUserLoggedIn
    events?: UserEvent[] // Collection of Events of the logged in user
    currentEvent?: UserEvent // When this is populated with Event data, open the component

    //DONT FORGET: Configure the event page route to take in userId (/events/{{userId}})
    constructor(private appUserService: AppUserService) { }

    ngOnInit(): void {
        // Get list of events that user owns or is an attendee of(invited)
        this.loggedInUser = this.appUserService.getLocalStorageUser()
    }

    createNewEvent() {
        // Opens a child component containing a event form 
        // ^ Try a modal?
    }
}
