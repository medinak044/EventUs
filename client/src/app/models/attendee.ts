import { AppUser } from "./appUser"
import { CheckListItem } from "./checkListItem"
import { EventRole } from "./eventRole"

export interface Attendee {
    id: number
    roleId: number
    eventRole: EventRole
    appUserId: string
    appUser: AppUser
    eventId: number
    checkListItems?: CheckListItem[]
}