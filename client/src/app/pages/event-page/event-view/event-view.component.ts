import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/userEvent';
import { Attendee } from 'src/app/models/attendee';
import { EventService } from 'src/app/services/event.service';
import { CheckListItem } from 'src/app/models/checkListItem';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  @Input() eventDetails!: UserEvent
  @Output() sentEventDetails = new EventEmitter<any>()  // Emit the event id to the parent component
  @Output() isFormActive = new EventEmitter<any>()  // Emit the event id to the parent component

  attendees!: Attendee[]
  defaultImg: string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

  constructor(
    public eventService: EventService
  ) { }

  ngOnInit(): void {
    this.getEventAttendees() // Get all attendee data for currently viewed event
  }

  getEventAttendees() {
    this.eventService.getEventAttendees(this.eventDetails.id).subscribe({
      next: (res: Attendee[]) => {
        this.attendees = res
      },
      error: (err) => { console.log(err) }
    })
  }

  checkBox(isChecked: boolean, checkListItem: CheckListItem) {
    checkListItem.isChecked = isChecked

    this.eventService.updateCheckListItem(checkListItem.id, checkListItem).subscribe({
      next: (res: CheckListItem) => {
        this.getEventAttendees() // Update visuals
        //  this.attendees = this.attendees.map((a: Attendee) => {
        //   if (a.id == checkListItem.attendeeId) {
        //     a.checkListItems = a.checkListItems?.map((c:CheckListItem) => {
        //       if (c.id == checkListItem.id) {
        //         return checkListItem
        //       } else {
        //         return c
        //       }
        //     })
        //   } else {
        //     return a
        //   }
        //  })
      },
      error: (err) => { console.log(err) }
    })
  }

  addCheckListitem() {

  }

  editCheckListItem() {

  }


  initEditEvent() {
    this.isFormActive.emit(true)
  }

  clearCurrentEvent() {
    this.sentEventDetails.emit(null) // Clear current event to go back to event dashboard
  }
}
