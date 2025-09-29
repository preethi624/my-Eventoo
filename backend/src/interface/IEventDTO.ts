<<<<<<< HEAD

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
  
=======
export interface IEventDTO {
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  title: string;
  description: string;
  date: Date;
  time: string;
  venue: string;
  category: string;
  ticketPrice: number;
  capacity: number;
<<<<<<< HEAD
  images: string[]|IEventImage[];
  organiser: string|Types.ObjectId;
=======
  images: string[];
  organiser: string;
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
  status: 'draft' | 'published' |'completed'| 'cancelled';
  ticketsSold: number;
  createdAt: Date;
  latitude: number;
  longitude: number;
  isBlocked:boolean;
<<<<<<< HEAD
  embedding?:number[];
   ticketTypes: ITicketType[]
=======
>>>>>>> a535fdf4047c75fc4aa927066293c6ed49b650fe
}