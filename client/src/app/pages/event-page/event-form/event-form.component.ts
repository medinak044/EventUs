import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUser } from 'src/app/models/appUser';
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
  @Output() isFormActive = new EventEmitter<any>()  // Emit the event id to the parent component
  @Output() sentEventDetails = new EventEmitter<any>()  // Emit the event id to the parent component

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
  }

  // initiateForm() {

  // }

  createNewEvent() {
    // Map eventForm to another model to be sent to api
    let e = {
      ...this.eventForm.value,
      // Add the rest of the neccessary properties to object
      image: "imageUrl",
      ownerId: this.currentUser.id

    }
    console.log(e)


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

  disableForm() {
    this.isFormActive.emit(false) // Hide form
  }
}
