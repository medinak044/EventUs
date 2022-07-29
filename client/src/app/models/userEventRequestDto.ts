export interface UserEventRequestDto {
    title: string
    location: string
    description: string
    startDate?: Date
    endDate?: Date
    image: string
    ownerId: string
}