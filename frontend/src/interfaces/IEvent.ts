
export interface IEventDTO {
    _id:string
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: string[];
  organiser: string;
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
  availableTickets?:number
}

export interface EventFetchResponse {
  success: boolean;
  message: string;
  result: {
    response: {
      events: IEventDTO[];
      totalPages: number;
      currentPage: number;
    };
  };
}
export interface EventCount{
  count?:number;
  success:boolean;

}

