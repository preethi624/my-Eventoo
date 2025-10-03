
import Types from 'mongoose';
export interface IEventImage{
  url:string;
  public_id:string|null

}
export interface ITicketType {
  type: string;
  price: number;
  capacity: number;
  sold?:number;
}

export interface IEventDTO {
  
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
  images: string[]|IEventImage[];
  organiser: string|Types.ObjectId;
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
  embedding?:number[];
   ticketTypes: ITicketType[]
}