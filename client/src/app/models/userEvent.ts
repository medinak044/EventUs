import { Attendee } from "./attendee"

export interface UserEvent {
    id: number
    title: string
    location: string
    description: string
    startDate?: Date
    endDate?: Date
    image: string
    ownerId: string
    attendees: Attendee[]
}
