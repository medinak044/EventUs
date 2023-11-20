import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { AppUser } from 'src/app/models/appUser';
import { UserEvent } from 'src/app/models/userEvent';
import { UserEventRequestDto } from 'src/app/models/userEventRequestDto';
import { AppUserService } from 'src/app/services/app-user.service';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-form',
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.css']
})
export class EventFormComponent implements OnInit {
  @Input() currentUser!: AppUser
  @Input() inputEvent!: UserEvent
  @Output() isFormActive = new EventEmitter<any>()  // Emit the event id to the parent component
  @Output() sentEventDetails = new EventEmitter<any>()  // Emit the event id to the parent component

  eventExists!: boolean // Determines whether or not 

  eventForm: UntypedFormGroup = this.fb.group({
    title: [''],
    location: [''],
    description: [''],
    startDate: [''],
    endDate: [''],
    image: [''],
    ownerId: ['']
  })

  constructor(
    public appUserService: AppUserService,
    public eventService: EventService,
    private fb: UntypedFormBuilder,
  ) { }

  ngOnInit(): void {
    // this.getCurrentDate()
    this.initiateForm()  // If event data was passed on to this component, fill out form
  }

  getCurrentDate() {
    let d = new Date()
  }

  initiateForm() {
    if (this.inputEvent) {
      const { title, location, description, image, startDate, endDate, ownerId } = this.inputEvent

      this.eventForm = this.fb.group({
        title: [title],
        location: [location],
        description: [description],
        image: [image],
        startDate: [startDate],
        endDate: [endDate],
        ownerId: [ownerId]
      })
    }
  }

  submitEventForm() {
    const eventForm = this.eventForm.value

    if (!this.inputEvent) {
      this.createNewEvent(eventForm)
    } else {
      this.editEvent(eventForm)
    }
  }

  createNewEvent(eventForm: UserEventRequestDto) {
    eventForm.ownerId = this.currentUser.id // Make sure to include the owner's id of the new event
    // console.log("Added!", eventForm)

    this.eventService.createEvent(eventForm).subscribe({
      next: (res: UserEvent) => {
        this.sentEventDetails.emit(res) // Send back newly created event from db to parent
        this.disableForm() // Go back to event dashboard
      },
      error: (err) => { console.log(err) }
    })
  }

  editEvent(eventForm: UserEventRequestDto) {
    // console.log("Updated!", eventForm)
    this.eventService.updateEvent(this.inputEvent?.id, eventForm).subscribe({
      next: (res: UserEvent) => {
        this.sentEventDetails.emit(res) // Send back newly edited event from db to parent
        this.disableForm() // Go back to event dashboard
      },
      error: (err) => { console.log(err) }
    })
  }

  disableForm() {
    this.isFormActive.emit(false) // Hide form
  }
}
