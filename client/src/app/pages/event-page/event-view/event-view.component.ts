import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/userEvent';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  @Input() eventDetails!: UserEvent
  @Output() sentEventDetails = new EventEmitter<any>()  // Emit the event id to the parent component

  constructor() { }

  ngOnInit(): void {
  }

  // switchCurrentEvent(nextEvent: UserEvent) {
  //   this.eventDetails = nextEvent // Changes current event without going back to event dashboard 
  // }

  clearCurrentEvent() {
    this.sentEventDetails.emit(null) // Clear current event to go back to event dashboard
  }
}
