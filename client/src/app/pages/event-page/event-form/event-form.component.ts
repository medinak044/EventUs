import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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

  eventForm: FormGroup = this.fb.group({
    title: [''],
    location: [''],
    description: [''],
    startDate: [''],
    endDate: [''],
    // image: [''],
    // ownerId: ['']
  })

  constructor(
    public appUserService: AppUserService,
    public eventService: EventService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    console.log(this.inputEvent)
    this.initiateForm()  // If event data was passed on to this component, fill out form
  }

  initiateForm() {
    if (this.inputEvent) {
      const { title, location, description, startDate, endDate } = this.inputEvent

      this.eventForm = this.fb.group({
        title: [title],
        location: [location],
        description: [description],
        startDate: [startDate],
        endDate: [endDate],
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

  createNewEvent(eventForm: any) {
    // Map eventForm to another model to be sent to api
    let eventRequestDto = {
      id: 0,
      ...eventForm,
      // Add the rest of the neccessary properties to object
      image: "",
      ownerId: this.currentUser.id
    }
    console.log(eventRequestDto)

    // //Currently UserEventRequestDto uses "interface"
    // //MAybe check how Neil Cummings handles forms
    // let newEventForm: UserEventRequestDto = new UserEventRe

    // this.eventService.createEvent().subscribe({
    //   next: (res: any) => {
    //     console.log(res)
    //     // this.sentEventDetails.emit(res) // Send back newly created event from db to parent
    //     this.disableForm() // Go back to event dashboard
    //   },
    //   error: (err) => { console.log(err) }
    // })
  }

  editEvent(eventForm: any) {
    let eventRequestDto = {
      id: this.inputEvent?.id,
      ...eventForm,
      // Add the rest of the neccessary properties to object
      image: this.inputEvent?.image,
      ownerId: this.inputEvent?.ownerId
    }
    console.log(eventRequestDto)

    // this.eventService.updateEvent(this.inputEvent?.id, eventRequestDto).subscribe({
    //   next: (res: UserEvent) => {
    //     console.log(res)
    //   },
    //   error: (err) => {console.log(err)}
    // })
  }

  disableForm() {
    this.isFormActive.emit(false) // Hide form
  }
}
