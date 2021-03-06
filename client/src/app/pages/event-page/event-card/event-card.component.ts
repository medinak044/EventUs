import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/userEvent';
import { AppUserService } from 'src/app/services/app-user.service';

@Component({
  selector: 'app-event-card',
  templateUrl: './event-card.component.html',
  styleUrls: ['./event-card.component.css']
})
export class EventCardComponent implements OnInit {
  @Input() eventDetails!: UserEvent
  @Output() sentEventDetails = new EventEmitter<any>() // Emit the event id to the parent component

  constructor(
    public appUserService: AppUserService,
  ) { }

  ngOnInit(): void {
  }

  // For setting the current event in parent component
  sendEventDetails() {
    this.sentEventDetails.emit(this.eventDetails)
  }

  html_IsLoggedInUser(): boolean {
    if (this.eventDetails.ownerId == this.appUserService.getLocalStorageUser().id) {
      return true
    } else {
      return false
    }
  }

}
