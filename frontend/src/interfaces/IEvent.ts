export interface ITicketType {
  type: string
  price: number;
  capacity: number;
  sold?:number;
  economic?:{price:number,cpacity:number};
  premium?:{price:number,capacity:number};
  vip?:{price:number,capacity:number}
  
  
  
}
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
  images: (string|IEventImage)[];
  organiser: string;
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
  availableTickets?:number;
 ticketTypes: ITicketType[]
  
}
export interface IEvent{
  _id:string
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: (string|IEventImage)[];
  organiser: string;
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
  availableTickets?:number;
 ticketTypes: {
    economic: { price: string; capacity: string };
    premium: { price: string; capacity: string };
    vip: { price: string; capacity: string };
  };

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

export interface Location {
  latitude: number;
  longitude: number;
}
export interface IEventImage{
  url:string;
  public_id:string|null

}
export interface EventApiResponse {
  success: boolean;
  result?: {
    response: {
      events: IEventDTO[];
      totalPages: number;
    };
  };
}
interface IEventResponse {
  currentPage: number;
  events: IEventDTO[];
  totalPages: number;
}

interface IGetAllEventsResult {
  message: string;
  response: IEventResponse;
}

export interface IGetAllEventsApiResponse {
  success: boolean;
  message: string;
  result: IGetAllEventsResult;
}

