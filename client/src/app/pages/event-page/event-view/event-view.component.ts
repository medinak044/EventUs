import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UserEvent } from 'src/app/models/userEvent';
import { Attendee } from 'src/app/models/attendee';
import { EventService } from 'src/app/services/event.service';
import { CheckListItem } from 'src/app/models/checkListItem';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUserService } from 'src/app/services/app-user.service';
import { AppUser } from 'src/app/models/appUser';
import { AppUserLoggedIn } from 'src/app/models/appUserLoggedIn';

@Component({
  selector: 'app-event-view',
  templateUrl: './event-view.component.html',
  styleUrls: ['./event-view.component.css']
})
export class EventViewComponent implements OnInit {
  @Input() eventDetails!: UserEvent
  @Output() sentEventDetails = new EventEmitter<any>()  // Emit the event id to the parent component
  @Output() isFormActive = new EventEmitter<any>()  // Emit the event id to the parent component

  loggedInUser!: AppUserLoggedIn
  attendees!: Attendee[]
  defaultImg: string = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png"

  checkListItemForm: FormGroup = this.fb.group({
    id: [0],
    isChecked: [false],
    description: [''],
    attendeeId: [0]
  })

  constructor(
    public appUserService: AppUserService,
    public eventService: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.loggedInUser = this.appUserService.getLocalStorageUser()
    this.getEventAttendees() // Get all attendee data for currently viewed event
  }

  html_IsLoggedInUser(): boolean {
    return (this.eventDetails.ownerId
      == this.appUserService.getLocalStorageUser().id) ? true : false
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
    if (!this.html_IsLoggedInUser()) return

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

  // Populate a modal with checklist item data
  initCheckListItem(attendeeId: number, checkListItem: any = null) {
    if (!checkListItem) {
      // Create a new form with attendeeId attached
      this.checkListItemForm = this.fb.group({
        id: [0],
        isChecked: [false],
        description: [''],
        attendeeId: [attendeeId]
      })
      // console.log(this.checkListItemForm.value)
    } else {
      this.checkListItemForm = this.fb.group({
        id: [checkListItem.id],
        isChecked: [checkListItem.isChecked],
        description: [checkListItem.description],
        attendeeId: [attendeeId]
      })
      console.log(this.checkListItemForm.value)
    }
  }

  submitCheckListItemForm() {
    const checkListItemForm = this.checkListItemForm.value

    if (checkListItemForm.id > 0) {
      this.updateCheckListItem(checkListItemForm)
    } else {
      this.addCheckListItem(checkListItemForm)
    }
  }

  updateCheckListItem(checkListItemForm: CheckListItem) {
    this.eventService.updateCheckListItem(checkListItemForm.id, checkListItemForm).subscribe({
      next: (res: any) => {
        this.getEventAttendees() // Update visuals
      },
      error: (err) => { console.log(err) }
    })
  }

  addCheckListItem(checkListItemForm: CheckListItem) {
    this.eventService.createCheckListItem(checkListItemForm).subscribe({
      next: (res: any) => {
        this.getEventAttendees() // Update visuals
      },
      error: (err) => { console.log(err) }
    })
  }

  removeCheckListItem(checkListItemForm: CheckListItem) {
    this.eventService.removeCheckListItem(checkListItemForm.id).subscribe({
      next: (res: any) => {
        this.getEventAttendees() // Update visuals
      },
      error: (err) => { console.log(err) }
    })
  }

  removeAttendeeFromEvent(attendeeId: number) {
    this.eventService.removeAttendee(attendeeId).subscribe({
      next: (res: any) => {
        this.getEventAttendees() // Update visuals
      },
      error: (err) => { console.log(err) }
    })
  }

  initEditEvent() {
    this.isFormActive.emit(true)
  }

  clearCurrentEvent() {
    this.sentEventDetails.emit(null) // Clear current event to go back to event dashboard
  }
}
