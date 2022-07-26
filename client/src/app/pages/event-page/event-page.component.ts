import { Component, OnInit } from '@angular/core';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
    selector: 'app-event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {
    currentUser!: AppUserLoggedIn
    events: any // Event[]
    currentEvent: any // Event

    //DONT FORGET: Configure the event page route to take in userId (/events/{{userId}})
    constructor(private appUserService: AppUserService) { }

    ngOnInit(): void {
        // Get list of events that user owns or is an attendee of(invited)
        this.currentUser = this.appUserService.getLocalStorageUser()
    }

    createNewEvent() {
        // Opens a child component containing a event form 
        // ^ Try a modal?
    }
}
