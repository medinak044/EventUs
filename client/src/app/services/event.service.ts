import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Attendee } from '../models/attendee';
import { AttendeeRequestDto } from '../models/attendeeRequestDto';
import { CheckListItem } from '../models/checkListItem';
import { EventRole } from '../models/eventRole';
import { UserEvent } from '../models/userEvent';
import { UserEventRequestDto } from '../models/userEventRequestDto';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventControllerUrl: string = "Event" // EventController
  private eventRoleControllerUrl: string = "EventRole" // EventRoleController
  private attendeeControllerUrl: string = "Attendee" // AttendeeController
  private checkListItemControllerUrl: string = "CheckListItem" // CheckListItemController

  constructor(
    private http: HttpClient,
  ) { }

  // ---- Event ---- //
  getAllEvents(userId: string): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>
      (`${environment.apiUrl}/${this.eventControllerUrl}/GetAllEvents/${userId}`)
  }

  getInvitedEventsByUserId(userId: string): Observable<Event[]> {
    return this.http.get<Event[]>
      (`${environment.apiUrl}/${this.eventControllerUrl}/GetInvitedEventsByUserId/${userId}`)
  }

  // Gets user events based on jwt token claims (user id)
  getUserEvents(): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>
      (`${environment.apiUrl}/${this.eventControllerUrl}/GetUserEvents`)
  }

  // Don't forget to also set the owner as an Attendee in db 
  createEvent(eventRequestDto: UserEventRequestDto): Observable<UserEvent> {
    return this.http.post<UserEvent>
      (`${environment.apiUrl}/${this.eventControllerUrl}/CreateEvent`, eventRequestDto)
  }

  updateEvent(eventId: number, eventRequestDto: UserEventRequestDto): Observable<UserEvent> {
    return this.http.put<UserEvent>
      (`${environment.apiUrl}/${this.eventControllerUrl}/UpdateEvent/${eventId}`, eventRequestDto)
  }

  removeEvent(eventId: number): Observable<UserEvent> {
    return this.http.delete<UserEvent>
      (`${environment.apiUrl}/${this.eventControllerUrl}/RemoveEvent/${eventId}`)
  }
  // -------- //

  // ---- EventRole ---- //
  getAllEventRoles(): Observable<EventRole[]> {
    return this.http.get<EventRole[]>
      (`${environment.apiUrl}/${this.eventRoleControllerUrl}/GetAllEventRoles`)
  }

  getEventRole(eventRoleId: number): Observable<UserEvent[]> {
    return this.http.get<UserEvent[]>
      (`${environment.apiUrl}/${this.eventRoleControllerUrl}/GetEventRole/${eventRoleId}`)
  }

  createEventRole(eventRole: EventRole) {
    return this.http.post
      (`${environment.apiUrl}/${this.eventRoleControllerUrl}/CreateEventRole`, eventRole)
  }

  updateEventRole(eventRoleId: number, eventRole: EventRole): Observable<EventRole> {
    return this.http.put<EventRole>
      (`${environment.apiUrl}/${this.eventRoleControllerUrl}/UpdateEventRole/${eventRoleId}`, eventRole)
  }

  removeEventRole(eventRoleId: number): Observable<EventRole> {
    return this.http.delete<EventRole>
      (`${environment.apiUrl}/${this.eventRoleControllerUrl}/RemoveEventRole/${eventRoleId}`)
  }
  // -------- //

  // ---- Attendee ---- //
  getAllAttendees(): Observable<Attendee[]> {
    return this.http.get<Attendee[]>
      (`${environment.apiUrl}/${this.attendeeControllerUrl}/GetAllAttendees`)
  }

  getEventAttendees(eventId: number): Observable<Attendee[]> {
    return this.http.get<Attendee[]>
      (`${environment.apiUrl}/${this.attendeeControllerUrl}/GetEventAttendees/${eventId}`)
  }

  createAttendee(attendeeRequestDto: AttendeeRequestDto) {
    return this.http.post
      (`${environment.apiUrl}/${this.attendeeControllerUrl}/CreateAttendee`, attendeeRequestDto)
  }

  updateAttendee(attendeeId: number, attendeeRequestDto: AttendeeRequestDto): Observable<Attendee> {
    return this.http.put<Attendee>
      (`${environment.apiUrl}/${this.attendeeControllerUrl}/UpdateAttendee/${attendeeId}`, attendeeRequestDto)
  }

  removeAttendee(attendeeId: number): Observable<Attendee> {
    return this.http.delete<Attendee>
      (`${environment.apiUrl}/${this.attendeeControllerUrl}/RemoveAttendee/${attendeeId}`)
  }
  // -------- //

  // ---- CheckListItem ---- //
  getAllCheckListItems() {
    return this.http.get
      (`${environment.apiUrl}/${this.checkListItemControllerUrl}/GetAllCheckListItems`)
  }

  getAttendeeCheckListItems(attendeeId: number): Observable<CheckListItem[]> {
    return this.http.get<CheckListItem[]>
      (`${environment.apiUrl}/${this.checkListItemControllerUrl}/GetAttendeeCheckListItems/${attendeeId}`)
  }

  createCheckListItem(newCheckListItem: CheckListItem) {
    return this.http.post
      (`${environment.apiUrl}/${this.checkListItemControllerUrl}/CreateCheckListItem`, newCheckListItem)
  }

  updateCheckListItem(checkListItemId: number, updatedCheckListItem: CheckListItem): Observable<CheckListItem> {
    return this.http.put<CheckListItem>
      (`${environment.apiUrl}/${this.checkListItemControllerUrl}/UpdateCheckListItem/${checkListItemId}`, updatedCheckListItem)
  }

  removeCheckListItem(checkListItemId: number) {
    return this.http.delete
      (`${environment.apiUrl}/${this.checkListItemControllerUrl}/RemoveCheckListItem/${checkListItemId}`)
  }
  // -------- //
}
